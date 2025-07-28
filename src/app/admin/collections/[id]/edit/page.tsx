"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';
import type { Category } from '@/types/category';
import type { Collection, UpdateCollectionRequest } from '@/types/collection';

const EditCollectionPage = () => {
    const router = useRouter();
    const params = useParams();
    const collectionId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [formData, setFormData] = useState<UpdateCollectionRequest>({
        name: '',
        slug: '',
        description: '',
        image: '',
        featured: false,
        status: 'ACTIVE',
        categoryId: 'none',
    });

    // Fetch collection data and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsInitialLoading(true);
                const [collectionResponse, categoriesResponse] = await Promise.all([
                    api.get(`/admin/collections/${collectionId}`),
                    api.get('/admin/categories')
                ]);

                const collectionData: Collection = collectionResponse.data;
                setCollection(collectionData);
                setFormData({
                    name: collectionData.name,
                    slug: collectionData.slug,
                    description: collectionData.description || '',
                    image: collectionData.image || '',
                    featured: collectionData.featured,
                    status: collectionData.status,
                    categoryId: collectionData.categoryId || 'none',
                });

                setCategories(categoriesResponse.data.categories);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Không thể tải dữ liệu bộ sưu tập');
                router.push('/admin/collections');
            } finally {
                setIsInitialLoading(false);
            }
        };

        if (collectionId) {
            fetchData();
        }
    }, [collectionId, router]);

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    // Handle input changes
    const handleInputChange = (field: keyof UpdateCollectionRequest, value: string | boolean) => {
        if (field === 'name' && typeof value === 'string') {
            setFormData(prev => ({
                ...prev,
                name: value,
                slug: generateSlug(value),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.slug) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setIsLoading(true);
            const dataToSend = {
                ...formData,
                categoryId: formData.categoryId === 'none' ? undefined : formData.categoryId,
            };
            await api.put(`/admin/collections/${collectionId}`, dataToSend);
            toast.success('Cập nhật bộ sưu tập thành công');
            router.push('/admin/collections');
        } catch (error) {
            console.error('Error updating collection:', error);
            // Error handling đã được xử lý trong axios interceptor
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitialLoading) {
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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chỉnh sửa bộ sưu tập</CardTitle>
                    <CardDescription>
                        Cập nhật thông tin bộ sưu tập &ldquo;{collection.name}&rdquo;
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên bộ sưu tập *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Nhập tên bộ sưu tập"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => handleInputChange('slug', e.target.value)}
                                    placeholder="ten-bo-suu-tap"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Danh mục</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(value) => handleInputChange('categoryId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Không có danh mục</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Image */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Ảnh</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                    placeholder="URL ảnh"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Nhập mô tả bộ sưu tập"
                                rows={4}
                            />
                        </div>

                        {/* Switches */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Nổi bật</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Hiển thị bộ sưu tập ở vị trí nổi bật
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Hoạt động</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Bộ sưu tập có hiển thị cho người dùng
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.status === 'ACTIVE'}
                                    onCheckedChange={(checked) => handleInputChange('status', checked ? 'ACTIVE' : 'INACTIVE')}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Đang cập nhật...' : 'Cập nhật bộ sưu tập'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCollectionPage; 