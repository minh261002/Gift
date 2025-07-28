"use client";

import React, { useState, useEffect, use } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CloudinaryUpload } from '@/components/layouts/cloudinary-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import slugify from "react-slugify";
import { api } from '@/lib/axios';
import type { Collection } from '@/types/collection';
import type { Category, CategoriesResponse } from '@/types/category';
import { collectionSchema, CollectionFormData } from '@/validations/collection';

const EditCollectionPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const router = useRouter();

    const form = useForm<CollectionFormData>({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            image: '',
            featured: false,
            status: 'ACTIVE',
            categoryId: 'none',
        },
    });

    // Fetch collection data
    const fetchCollection = async () => {
        try {
            const response = await api.get(`/admin/collections/${id}`);
            const data = response.data;
            setCollection(data);

            // Set form values
            form.reset({
                name: data.name,
                slug: data.slug,
                description: data.description || '',
                image: data.image || '',
                featured: data.featured,
                status: data.status,
                categoryId: data.categoryId || 'none',
            });
        } catch (error) {
            console.error('Error fetching collection:', error);
            // Error handling đã được xử lý trong axios interceptor
            router.push('/admin/collections');
        } finally {
            setIsInitialLoading(false);
        }
    };

    // Fetch categories for select
    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories', { params: { limit: 100 } });
            const data: CategoriesResponse = response.data;
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Error handling đã được xử lý trong axios interceptor
        }
    };

    useEffect(() => {
        fetchCollection();
        fetchCategories();
    }, [id]);

    // Handle form submission
    const onSubmit = async (data: CollectionFormData) => {
        try {
            setIsLoading(true);
            // Convert "none" to undefined for categoryId
            const formData = {
                ...data,
                categoryId: data.categoryId === 'none' ? undefined : data.categoryId,
            };

            await api.put(`/admin/collections/${id}`, formData);
            toast.success('Cập nhật bộ sưu tập thành công');
            router.push('/admin/collections');
        } catch (error) {
            console.error('Error submitting form:', error);
            // Error handling đã được xử lý trong axios interceptor
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        const slug = slugify(name);
        form.setValue('slug', slug);
    };

    if (isInitialLoading) {
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột chính - Thông tin bộ sưu tập */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin bộ sưu tập</CardTitle>
                            <CardDescription>
                                Cập nhật thông tin bộ sưu tập
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên bộ sưu tập</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nhập tên bộ sưu tập"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handleNameChange(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ten-bo-suu-tap"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    URL-friendly version của tên bộ sưu tập
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Danh mục</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Chọn danh mục (tùy chọn)" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="none">Không có danh mục</SelectItem>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Chọn danh mục cho bộ sưu tập này
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Nhập mô tả bộ sưu tập"
                                                        className="resize-none"
                                                        rows={4}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Mô tả chi tiết về bộ sưu tập
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Hoạt động</FormLabel>
                                                    <FormDescription>
                                                        Bộ sưu tập có hiển thị cho người dùng
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value === 'ACTIVE'}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked ? 'ACTIVE' : 'INACTIVE');
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="featured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Nổi bật</FormLabel>
                                                    <FormDescription>
                                                        Hiển thị bộ sưu tập này ở vị trí nổi bật
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Cột phụ - Ảnh và Submit */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ảnh bộ sưu tập</CardTitle>
                            <CardDescription>
                                Upload ảnh đại diện cho bộ sưu tập
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <CloudinaryUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    folder="collections"
                                                    placeholder="Upload ảnh bộ sưu tập"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thao tác</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-2">
                            <Button
                                type="submit"
                                className="w-1/2"
                                disabled={isLoading}
                                onClick={form.handleSubmit(onSubmit)}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Đang cập nhật...' : 'Cập nhật bộ sưu tập'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-1/2"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Hủy
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EditCollectionPage; 