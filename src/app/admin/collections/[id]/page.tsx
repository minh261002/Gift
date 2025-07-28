"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Star, CheckCircle, XCircle, Calendar, Hash } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/axios';
import type { Collection } from '@/types/collection';

const CollectionDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const collectionId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [collection, setCollection] = useState<Collection | null>(null);

    // Fetch collection data
    useEffect(() => {
        const fetchCollection = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/admin/collections/${collectionId}`);
                setCollection(response.data);
            } catch (error) {
                console.error('Error fetching collection:', error);
                router.push('/admin/collections');
            } finally {
                setIsLoading(false);
            }
        };

        if (collectionId) {
            fetchCollection();
        }
    }, [collectionId, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Không tìm thấy bộ sưu tập</p>
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
                    variant="ghost"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại
                </Button>
                <Button
                    onClick={() => router.push(`/admin/collections/${collection.id}/edit`)}
                    className="gap-2"
                >
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-2xl">{collection.name}</CardTitle>
                                {collection.featured && (
                                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                )}
                            </div>
                            <CardDescription>
                                Slug: <code className="text-xs bg-muted px-2 py-1 rounded">{collection.slug}</code>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Image */}
                            {collection.image && (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                                    <Image
                                        src={collection.image}
                                        alt={collection.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            {collection.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">Mô tả</h3>
                                    <p className="text-muted-foreground">{collection.description}</p>
                                </div>
                            )}

                            {/* Category */}
                            <div>
                                <h3 className="font-semibold mb-2">Danh mục</h3>
                                {collection.category ? (
                                    <Badge variant="secondary">{collection.category.name}</Badge>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Không có danh mục</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Information */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Trạng thái</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Hoạt động</span>
                                {collection.status === 'ACTIVE' ? (
                                    <div className="flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Có</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">Không</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Nổi bật</span>
                                {collection.featured ? (
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm">Có</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">Không</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Thông tin</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">ID:</span>
                                <code className="text-xs bg-muted px-2 py-1 rounded">{collection.id}</code>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Tạo lúc:</span>
                                <span className="text-muted-foreground">{formatDate(collection.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Cập nhật:</span>
                                <span className="text-muted-foreground">{formatDate(collection.updatedAt)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetailPage; 