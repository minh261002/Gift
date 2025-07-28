"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Star, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTables/data-table';
import { DataTableRowActions } from '@/components/dataTables/data-table-row-actions';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { api } from '@/lib/axios';
import type { Collection, CollectionsResponse } from '@/types/collection';

const CollectionsPage = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const router = useRouter();

    // Fetch collections
    const fetchCollections = async (page = 1, search = '') => {
        try {
            setIsLoading(true);
            const params = {
                page: page.toString(),
                limit: '10',
                ...(search && { search }),
            };

            const response = await api.get('/admin/collections', { params });
            const data: CollectionsResponse = response.data;
            setCollections(data.collections);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections(1, searchTerm);
    }, [searchTerm]);

    // Handle search change
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    // Handle export
    const handleExport = () => {
        toast.info('Tính năng xuất dữ liệu đang được phát triển');
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchCollections(1, searchTerm);
    };

    // Handle delete
    const handleDelete = async (collection: Collection) => {
        try {
            await api.delete(`/admin/collections/${collection.id}`);
            toast.success('Xóa bộ sưu tập thành công');
            fetchCollections();
        } catch (error) {
            console.error('Error deleting collection:', error);
            // Error handling đã được xử lý trong axios interceptor
        }
    };

    // Handle edit
    const handleEdit = (collection: Collection) => {
        router.push(`/admin/collections/${collection.id}/edit`);
    };

    // Handle view
    const handleView = (collection: Collection) => {
        router.push(`/admin/collections/${collection.id}`);
    };

    // Handle add new
    const handleAddNew = () => {
        router.push('/admin/collections/new');
    };

    // Handle status toggle
    const handleStatusToggle = async (collection: Collection) => {
        try {
            // Toggle between ACTIVE and INACTIVE
            const newStatus = collection.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

            await api.patch(`/admin/collections/${collection.id}/status`, {
                status: newStatus
            });

            toast.success(`Cập nhật trạng thái bộ sưu tập "${collection.name}" thành công`);
            fetchCollections(); // Refresh the list
        } catch (error) {
            console.error('Error updating collection status:', error);
            // Error handling đã được xử lý trong axios interceptor
        }
    };

    const columns: ColumnDef<Collection>[] = [
        {
            accessorKey: 'image',
            header: 'Ảnh',
            cell: ({ row }) => (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    {row.original.image ? (
                        <Image
                            src={row.original.image}
                            alt={row.original.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <span className="text-xs">No image</span>
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Tên bộ sưu tập',
            cell: ({ row }) => (
                <div className="font-medium">{row.original.name}</div>
            ),
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => (
                <code className="text-xs bg-muted px-2 py-1 rounded">
                    {row.original.slug}
                </code>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Danh mục',
            cell: ({ row }) => (
                <div>
                    {row.original.category ? (
                        <Badge variant="secondary">{row.original.category.name}</Badge>
                    ) : (
                        <span className="text-muted-foreground text-sm">Không có</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'featured',
            header: 'Nổi bật',
            cell: ({ row }) => (
                <div>
                    {row.original.featured ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    ) : (
                        <span className="text-muted-foreground text-sm">Không</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Trạng thái',
            cell: ({ row }) => {
                const collection = row.original;
                const status = collection.status;

                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={status === 'ACTIVE'}
                            onCheckedChange={() => handleStatusToggle(collection)}
                            className="data-[state=checked]:bg-green-500"
                        />
                        <span className="text-sm text-muted-foreground">
                            {status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Thao tác',
            cell: ({ row }) => (
                <DataTableRowActions
                    row={row}
                    actions={[
                        {
                            label: 'Xem',
                            onClick: handleView,
                            icon: Eye,
                        },
                        {
                            label: 'Chỉnh sửa',
                            onClick: handleEdit,
                            icon: Edit,
                        },
                        {
                            label: 'Xóa',
                            onClick: handleDelete,
                            icon: Trash2,
                            variant: 'destructive',
                            separator: true,
                            confirmTitle: 'Xác nhận xóa bộ sưu tập',
                            confirmMessage: `Bạn có chắc chắn muốn xóa bộ sưu tập "${row.original.name}"? Hành động này không thể hoàn tác.`,
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Danh sách bộ sưu tập</CardTitle>
                        <CardDescription>
                            Tổng cộng {pagination.total} bộ sưu tập
                        </CardDescription>
                    </div>
                    <div className="flex items-center justify-end">
                        <Button onClick={handleAddNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm bộ sưu tập
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={collections}
                        searchKey="name"
                        searchPlaceholder="Tìm kiếm bộ sưu tập..."
                        isLoading={isLoading}
                        emptyMessage="Không có bộ sưu tập nào."
                        onSearchChange={handleSearchChange}
                        onExport={handleExport}
                        onRefresh={handleRefresh}
                        showToolbar={true}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default CollectionsPage; 