"use client";

import React, { useState, useEffect } from 'react';
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
import type { Category, CategoriesResponse } from '@/types/category';
import type { CreateCollectionRequest } from '@/types/collection';
import { collectionSchema, CollectionFormData } from '@/validations/collection';

const NewCollectionPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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

    // Fetch categories for dropdown
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
        fetchCategories();
    }, []);

    // Handle form submission
    const onSubmit = async (data: CollectionFormData) => {
        try {
            setIsLoading(true);
            // Convert "none" to undefined for categoryId
            const formData = {
                ...data,
                categoryId: data.categoryId === 'none' ? undefined : data.categoryId,
            };

            await api.post('/admin/collections', formData);
            toast.success('Tạo bộ sưu tập thành công');
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột chính - Thông tin bộ sưu tập */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin bộ sưu tập</CardTitle>
                            <CardDescription>
                                Điền thông tin để tạo bộ sưu tập mới
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
                                                    Chọn danh mục liên quan đến bộ sưu tập
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
                                {isLoading ? 'Đang tạo...' : 'Tạo bộ sưu tập'}
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

export default NewCollectionPage; 