"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, CheckCircle2, Truck, Check, XCircle } from "lucide-react";

interface Order {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    profiles?: { full_name: string; phone: string };
    addresses?: { details: string };
    order_items?: any[];
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();

        // Subscribe to real-time order updates
        const subscription = supabase
            .channel('public:orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('New order received!', payload);
                    // Fetch full details of the new order
                    fetchSingleOrder(payload.new.id);
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                (payload) => {
                    setOrders(currentOrders =>
                        currentOrders.map(o => o.id === payload.new.id ? { ...o, status: payload.new.status } : o)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profiles (full_name, phone),
                addresses (details),
                order_items (
                    quantity,
                    price_at_time_of_order,
                    menu_items (name)
                )
            `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (data && !error) {
            setOrders(data as any);
        } else {
            console.error("Failed to fetch orders:", error);
        }
        setLoading(false);
    };

    const fetchSingleOrder = async (id: string) => {
        const { data } = await supabase
            .from('orders')
            .select('*, profiles(full_name, phone), addresses(details), order_items(quantity, price_at_time_of_order, menu_items(name))')
            .eq('id', id)
            .single();

        if (data) {
            setOrders(current => [data as any, ...current]);
        }
    };

    const updateOrderStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
        if (error) {
            alert('Failed to update status: ' + error.message);
        } else {
            // Optimistic update
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'preparing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'out_for_delivery': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
        }
    };

    if (loading) {
        return <div className="text-zinc-500 animate-pulse">Loading orders...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black title-font flex items-center gap-3">
                        Live Orders
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </h1>
                    <p className="text-zinc-500 mt-1">Manage incoming requests automatically.</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
                    <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-zinc-300">No Orders Yet</h3>
                    <p className="text-zinc-500 text-sm mt-1">When customers place orders, they will appear here instantly.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-5 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-black text-lg text-white">#{order.id.split('-')[0].toUpperCase()}</h3>
                                        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${getStatusColor(order.status)}`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        {new Date(order.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-2xl font-black text-primary">₹{order.total_amount}</p>
                                </div>
                            </div>

                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Customer Details</h4>
                                    <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/50">
                                        <p className="font-bold text-zinc-100">{order.profiles?.full_name || 'Guest User'}</p>
                                        <p className="text-sm text-zinc-400 mt-1">{order.profiles?.phone || 'No phone provided'}</p>
                                    </div>

                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-6 mb-3">Delivery Address</h4>
                                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                        <p className="text-sm text-zinc-300 whitespace-pre-line">{order.addresses?.details || 'Pickup / No address'}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col h-full">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Order Items</h4>
                                    <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/50 flex-grow">
                                        <ul className="space-y-3">
                                            {order.order_items?.map((item: any, idx: number) => (
                                                <li key={idx} className="flex justify-between items-start text-sm">
                                                    <span className="text-zinc-300"><span className="font-bold text-zinc-500 mr-2">{item.quantity}x</span> {item.menu_items?.name || 'Unknown Item'}</span>
                                                    <span className="font-medium text-zinc-400">₹{item.price_at_time_of_order * item.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex flex-wrap gap-2 justify-end">
                                        {order.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors"><XCircle className="w-4 h-4" /> Reject</button>
                                                <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="px-4 py-2 bg-orange-500 text-black hover:bg-orange-600 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors"><CheckCircle2 className="w-4 h-4" /> Accept & Prepare</button>
                                            </>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button onClick={() => updateOrderStatus(order.id, 'out_for_delivery')} className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors"><Truck className="w-4 h-4" /> Out for Delivery</button>
                                        )}
                                        {order.status === 'out_for_delivery' && (
                                            <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors"><Check className="w-4 h-4" /> Mark Delivered</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
