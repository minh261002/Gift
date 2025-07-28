"use client";

import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, Edit, Trash2, Star, Calendar, Hash, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/axios';
import type { Collection } from '@/types/collection';

const CollectionDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch collection data
    const fetchCollection = async () => {
        try {
            const response = await api.get(`/admin/collections/${id}`);
            const data = response.data;
            setCollection(data);
        } catch (error) {
            console.error('Error fetching collection:', error);
            router.push('/admin/collections');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCollection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Handle delete
    const handleDelete = async () => {
        if (!collection) return;

        try {
            await api.delete(`/admin/collections/${collection.id}`);
            toast.success('Xóa bộ sưu tập thành công');
            router.push('/admin/collections');
        } catch (error) {
            console.error('Error deleting collection:', error);
            // Error handling đã được xử lý trong axios interceptor
        }
    };

    // Handle edit
    const handleEdit = () => {
        router.push(`/admin/collections/${id}/edit`);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-muted-foreground">Không tìm thấy bộ sưu tập</h2>
                    <p className="text-muted-foreground mt-2">
                        Bộ sưu tập bạn đang tìm kiếm không tồn tại
                    </p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div className="flex gap-2">
                    <Button onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa bộ sưu tập</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa bộ sưu tập &quot;{collection.name}&quot;?
                                    Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn bộ sưu tập này.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Xóa bộ sưu tập
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                        <CardDescription>
                            Thông tin chính của bộ sưu tập
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                <Image
                                    src={collection.image || "https://res.cloudinary.com/doy3slx9i/image/upload/v1735367389/Pengu/not-found_y7uha7.jpg"}
                                    alt={collection.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">{collection.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                        {collection.slug}
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Trạng thái:</span>
                                <div className="flex items-center gap-2">
                                    {collection.status === 'ACTIVE' ? (
                                        <Badge variant="default">Hoạt động</Badge>
                                    ) : (
                                        <Badge variant="secondary">Không hoạt động</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Trạng thái nổi bật:</span>
                                <div className="flex items-center gap-2">
                                    {collection.featured ? (
                                        <>
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            <Badge variant="default">Nổi bật</Badge>
                                        </>
                                    ) : (
                                        <Badge variant="secondary">Bình thường</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Danh mục:</span>
                                <div>
                                    {collection.category ? (
                                        <Badge variant="outline">{collection.category.name}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">Không có</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timestamps */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin thời gian</CardTitle>
                        <CardDescription>
                            Thời gian tạo và cập nhật bộ sưu tập
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Ngày tạo:</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{formatDate(collection.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Cập nhật lần cuối:</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{formatDate(collection.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Description */}
            {collection.description && (
                <Card>
                    <CardHeader>
                        <CardTitle>Mô tả</CardTitle>
                        <CardDescription>
                            Thông tin chi tiết về bộ sưu tập
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                {collection.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CollectionDetailPage; 