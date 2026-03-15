import { useEffect, useState } from 'react';
import { 
  Upload, 
  FileText, 
  History, 
  CreditCard, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  ChevronRight,
  Sparkles,
  GraduationCap,
  PenTool,
  BookOpen,
  Search,
  Plus,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import {
  createOrder,
  getAdminOrders,
  getAdminStats,
  getAdminUsers,
  getOrders,
  getWallet,
  topupWallet,
  updateOrder,
  deleteOrder,
  adminAddWallet,
  adminAddSlots,
} from '@/lib/api';
import type { Document } from '@/types';


const services = [
  { id: 'plagiarism', name: 'Plagiarism Report', icon: Search, price: 15 },
  { id: 'ai', name: 'AI Detection Report', icon: Sparkles, price: 15 },
  { id: 'proofread', name: 'Proofreading', icon: PenTool, price: 25 },
  { id: 'citation', name: 'Citation Help', icon: BookOpen, price: 20 },
  { id: 'assignment', name: 'Assignment Help', icon: FileText, price: 50 },
  { id: 'combo', name: 'Complete Package', icon: CheckCircle, price: 75 },
];

interface DashboardProps {
  onClose: () => void;
}

export default function Dashboard({ onClose }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);

  const { user, logout } = useAuth();
  const isAdmin = user?.isAdmin;


  const handleLogout = () => {
    logout();
    setDocuments([]);
    setAvailableSlots(0);
    setWalletBalance(0);
    onClose();
  };

  const loadDashboard = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const walletData = await getWallet();
      const orders = await getOrders();

      setWalletBalance(walletData.balance ?? 0);
      setAvailableSlots(walletData.slots ?? 0);

      // Ensure dates are parsed into Date objects
      setDocuments(
        (orders || []).map((order: any) => ({
          ...order,
          uploadedAt: order.uploadedAt ? new Date(order.uploadedAt) : new Date(),
          completedAt: order.completedAt ? new Date(order.completedAt) : undefined,
        }))
      );
    } catch (err: any) {
      setError(err?.message || 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminData = async () => {
    if (!isAdmin) return;

    try {
      const [stats, users, orders] = await Promise.all([getAdminStats(), getAdminUsers(), getAdminOrders()]);
      setAdminStats(stats);
      setAdminUsers(users);
      setAdminOrders(orders);
    } catch (err) {
      // ignore admin fetch errors
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return <AlertCircle className="w-5 h-5 text-text-gray" />;
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-error/10 text-error hover:bg-error/20">Failed</Badge>;
      default:
        return <Badge className="bg-text-gray/10 text-text-gray">Pending</Badge>;
    }
  };

  const handleServiceSelect = async (service: typeof services[0]) => {
    setShowNewOrderDialog(false);

    if (availableSlots <= 0) {
      alert('You have no upload slots available. Please add funds to get more slots.');
      return;
    }

    try {
      await createOrder({
        service: service.name,
        price: service.price,
        filename: `${service.id}-${Date.now()}.pdf`,
        fileSize: 1024 * 1024, // placeholder size
      });

      await loadDashboard();
      setActiveTab('orders');
    } catch (error: any) {
      alert(error?.message || 'Unable to create order.');
    }
  };

  const handleTopUp = async (amount: number, method = 'bank') => {
    try {
      setShowTopUpDialog(false);
      await topupWallet(amount, method);
      await loadDashboard();
      alert(`Wallet topped up by $${amount}. Slots have been updated accordingly.`);
    } catch (error: any) {
      alert(error?.message || 'Unable to add funds.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-auto">
      {/* Header */}
      <header className="bg-white border-b border-light-gray px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-xl text-secondary">
                Academic<span className="text-primary">Assist</span>
              </h1>
              <p className="font-inter text-xs text-text-gray">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-inter text-sm font-medium text-secondary">${walletBalance}</span>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-inter text-sm font-medium text-secondary">{user?.name}</p>
              <p className="font-inter text-xs text-text-gray">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 rounded-xl bg-error/10 px-6 py-4 text-error">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="mb-6 rounded-xl bg-primary/10 px-6 py-4 text-primary">
            Loading dashboard...
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">My Orders</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
              <h2 className="font-poppins font-bold text-2xl mb-2">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h2>
              <p className="font-inter text-white/80 mb-4">
                You have {availableSlots} upload slots available and ${walletBalance} in your wallet.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => setShowNewOrderDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => setShowTopUpDialog(true)}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Top Up Wallet
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: documents.length, icon: FileText, color: 'primary' },
                { label: 'Available Slots', value: availableSlots, icon: Upload, color: 'success' },
                { label: 'Wallet Balance', value: `$${walletBalance}`, icon: Wallet, color: 'warning' },
                { label: 'Completed', value: documents.filter(d => d.status === 'completed').length, icon: CheckCircle, color: 'success' },
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-inter text-sm text-text-gray">{stat.label}</p>
                        <p className="font-poppins font-bold text-2xl text-secondary">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-poppins text-lg">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.length === 0 ? (
                    <div className="p-6 text-center text-text-gray">
                      No orders yet. Place your first order to get started.
                    </div>
                  ) : (
                    documents.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(doc.status)}
                          <div>
                            <p className="font-inter font-medium text-secondary">{doc.originalName}</p>
                            <p className="font-inter text-xs text-text-gray">
                              {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {doc.status === 'completed' && (
                            <div className="hidden sm:flex gap-4">
                              <div className="text-right">
                                <p className="font-inter text-xs text-text-gray">AI Score</p>
                                <p className="font-inter font-medium text-secondary">{doc.aiScore}%</p>
                              </div>
                              <div className="text-right">
                                <p className="font-inter text-xs text-text-gray">Plagiarism</p>
                                <p className="font-inter font-medium text-secondary">{doc.plagiarismScore}%</p>
                              </div>
                            </div>
                          )}
                          {getStatusBadge(doc.status)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins font-bold text-2xl text-secondary">My Orders</h2>
              <Button onClick={() => setShowNewOrderDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </div>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-[700px] divide-y divide-light-gray">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(doc.status)}
                        <div>
                          <p className="font-inter font-medium text-secondary">{doc.originalName}</p>
                          <p className="font-inter text-xs text-text-gray">
                            {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {doc.status === 'completed' && (
                          <div className="hidden sm:flex gap-6">
                            <div className="text-right">
                              <p className="font-inter text-xs text-text-gray">AI Score</p>
                              <p className={`font-inter font-medium ${doc.aiScore && doc.aiScore > 20 ? 'text-error' : 'text-success'}`}>
                                {doc.aiScore}%
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-inter text-xs text-text-gray">Plagiarism</p>
                              <p className={`font-inter font-medium ${doc.plagiarismScore && doc.plagiarismScore > 20 ? 'text-error' : 'text-success'}`}>
                                {doc.plagiarismScore}%
                              </p>
                            </div>
                          </div>
                        )}
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <h2 className="font-poppins font-bold text-2xl text-secondary">Our Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-poppins font-semibold text-lg text-secondary mb-2">
                      {service.name}
                    </h3>
                    <p className="font-poppins font-bold text-2xl text-primary mb-4">
                      ${service.price}
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleServiceSelect(service)}
                    >
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <h2 className="font-poppins font-bold text-2xl text-secondary">My Wallet</h2>
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <p className="font-inter text-text-gray mb-2">Current Balance</p>
                  <p className="font-poppins font-bold text-5xl text-primary">${walletBalance}</p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => setShowTopUpDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-poppins text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Bank Transfer', icon: '💳', description: 'Direct bank transfer' },
                    { name: 'Cryptocurrency', icon: '₿', description: 'BTC, ETH, USDT' },
                    { name: 'PayPal', icon: 'P', description: 'Secure PayPal payment' },
                    { name: 'Wise', icon: 'W', description: 'International transfer' },
                  ].map((method, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-light-gray rounded-xl">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-inter font-medium text-secondary">{method.name}</p>
                        <p className="font-inter text-xs text-text-gray">{method.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <h2 className="font-poppins font-bold text-2xl text-secondary">Admin Dashboard</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: adminStats?.totalUsers ?? 0 },
                  { label: 'Total Orders', value: adminStats?.totalOrders ?? 0 },
                  { label: 'Total Revenue', value: `$${adminStats?.totalRevenue ?? 0}` },
                  { label: 'Pending Orders', value: adminStats?.pendingOrders ?? 0 },
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-inter text-sm text-text-gray">{stat.label}</p>
                          <p className="font-poppins font-bold text-2xl text-secondary">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="font-poppins text-lg">Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Slots</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>${u.wallet}</TableCell>
                          <TableCell>{u.slots}</TableCell>
                          <TableCell>{u.orders}</TableCell>
                          <TableCell className="space-x-2">
                            <Button
                              size="sm"
                              onClick={async () => {
                                await adminAddWallet(u.id, 10);
                                await loadAdminData();
                              }}
                            >
                              +$10
                            </Button>
                            <Button
                              size="sm"
                              onClick={async () => {
                                await adminAddSlots(u.id, 1);
                                await loadAdminData();
                              }}
                            >
                              +1 slot
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="font-poppins text-lg">All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.userId}</TableCell>
                          <TableCell>{order.service}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>{order.uploadedAt ? new Date(order.uploadedAt).toLocaleString() : ''}</TableCell>
                          <TableCell className="space-x-2">
                            <Button
                              size="sm"
                              onClick={async () => {
                                await updateOrder(order.id, { status: 'completed' });
                                await loadAdminData();
                                await loadDashboard();
                              }}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                await deleteOrder(order.id);
                                await loadAdminData();
                                await loadDashboard();
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* New Order Dialog */}
      <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-poppins text-xl">Place New Order</DialogTitle>
            <DialogDescription className="font-inter text-text-gray">
              Select a service to get started. Payment instructions will be sent to your email/WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="flex items-start gap-4 p-4 rounded-xl border border-light-gray hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-inter font-medium text-secondary">{service.name}</p>
                  <p className="font-poppins font-bold text-primary">${service.price}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <p className="font-inter text-sm text-text-gray">
              <strong>Note:</strong> After selecting a service, you will receive payment instructions via email or WhatsApp. Once payment is confirmed, we'll process your order.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Up Dialog */}
      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-poppins text-xl">Add Funds to Wallet</DialogTitle>
            <DialogDescription className="font-inter text-text-gray">
              Select an amount to add to your wallet.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[25, 50, 100, 150, 200, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => handleTopUp(amount, 'bank')}
                className="p-4 rounded-xl border border-light-gray hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                <p className="font-poppins font-bold text-secondary">${amount}</p>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <p className="font-inter text-sm text-text-gray mb-2">Payment Methods:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Bank Transfer</Badge>
              <Badge variant="outline">Crypto (BTC/ETH/USDT)</Badge>
              <Badge variant="outline">PayPal</Badge>
              <Badge variant="outline">Wise</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
