import React, { useState, ChangeEvent, DragEvent, useEffect } from 'react'
import { ArrowLeft, Upload, X, Save, AlertCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { http } from '../../helpers/axios'
import { Category, MenuItem, SelectOption } from '../../types'
import Swal from 'sweetalert2'

interface FormDataInput {
    name: string
    description: string
    price: string
    category: string
    image: File | null
    isSpicy: boolean
    isAvailable: boolean
}

interface FormErrors {
    name?: string
    description?: string
    price?: string
    category?: string
    image?: string
}

const Input: React.FC<{
    label?: string
    error?: string
    required?: boolean
    className?: string
    [key: string]: unknown
}> = ({ label, error, required = false, className = "", ...props }) => (
    <div className={className}>
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <input
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            {...props}
        />
        {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
            </p>
        )}
    </div>
)

const TextArea: React.FC<{
    label?: string
    error?: string
    required?: boolean
    className?: string
    rows?: number
    [key: string]: unknown
}> = ({ label, error, required = false, className = "", rows = 4, ...props }) => (
    <div className={className}>
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <textarea
            rows={rows}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-vertical ${
                error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            {...props}
        />
        {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
            </p>
        )}
    </div>
)

const Select: React.FC<{
    label?: string
    error?: string
    required?: boolean
    options?: SelectOption[]
    className?: string
    [key: string]: unknown
}> = ({ label, error, required = false, options = [], className = "", ...props }) => (
    <div className={className}>
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <select
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            {...props}
        >
            <option value=''>Pilih Kategori</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
            </p>
        )}
    </div>
)

const ImageUpload: React.FC<{
    onImageChange: (file: File | null) => void
    preview: string | null
    error?: string
}> = ({ onImageChange, preview, error }) => {
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageChange(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0])
        }
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Menu
            </label>
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                        ? 'border-orange-400 bg-orange-50'
                        : error
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onImageChange(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div>
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                            Drag & drop gambar di sini, atau{" "}
                            <label className="text-orange-600 hover:text-orange-700 cursor-pointer font-medium">
                                pilih file
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                            </label>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG hingga 5MB</p>
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                </p>
            )}
        </div>
    )
}

const Toggle: React.FC<{
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    description?: string
}> = ({ label, checked, onChange, description }) => (
    <div className="flex items-start">
        <div className="flex items-center h-5">
            <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    checked ? 'bg-orange-600' : 'bg-gray-200'
                }`}
                onClick={() => onChange(!checked)}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
        <div className="ml-3">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}
        </div>
    </div>
)

export default function SuperAdminEditMenu() {
    const { id } = useParams()
    const [formData, setFormData] = useState<FormDataInput>({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
        isSpicy: false,
        isAvailable: true
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState<SelectOption[]>([])
    const navigate = useNavigate()

    const handleInputChange = (field: keyof FormDataInput, value: string | boolean | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleImageChange = (file: File | null) => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            setFormData(prev => ({ ...prev, image: file }))
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: '' }))
            }
        } else {
            setImagePreview(null)
            setFormData(prev => ({ ...prev, image: null }))
        }
    }

    const fetchMenuItem = async () => {
        try {
            const response = await http({
                method: 'get',
                url: `/menus/${id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }
            })

            const menu: MenuItem = response.data.data
            setFormData({
                name: menu.name,
                description: menu.description,
                price: String(menu.price),
                category: String(menu.category_id),
                image: null,
                isSpicy: menu.is_spicy,
                isAvailable: menu.is_avaible
            })
            setImagePreview(menu.image_url)
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load menu data'
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await http({
                method: 'get',
                url: '/categories',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }
            })

            setCategories(response.data.data.map((category: Category) => ({
                value: category.id,
                label: category.name
            })))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategories()
        fetchMenuItem()
    }, [id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const reqBody = new FormData()
        reqBody.append('name', formData.name)
        reqBody.append('description', formData.description)
        reqBody.append('price', formData.price)
        reqBody.append('categoryId', formData.category)
        reqBody.append('isSpicy', String(formData.isSpicy))
        reqBody.append('isAvailable', String(formData.isAvailable))
        if (formData.image) reqBody.append('image', formData.image)

        setIsSubmitting(true)

        try {
            await http({
                method: 'put',
                url: `/menus/${id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                data: reqBody
            })

            Swal.fire({
                title: 'Berhasil',
                text: 'Menu berhasil diperbarui',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/superadmin/menu')
            })
        } catch (error) {
            console.error('Error:', error)
            Swal.fire({
                title: 'Terjadi Kesalahan',
                text: 'Gagal memperbarui menu. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/superadmin/menu')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Menu</h1>
                    <p className="text-sm text-gray-600">Perbarui informasi menu</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informasi Menu</h2>

                            <div className="space-y-6">
                                <Input
                                    label="Nama Menu"
                                    required
                                    value={formData.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                                    placeholder="Contoh: Rendang Daging"
                                    error={errors.name}
                                />

                                <TextArea
                                    label="Deskripsi Menu"
                                    required
                                    value={formData.description}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                                    placeholder="Jelaskan menu dengan detail yang menarik..."
                                    rows={4}
                                    error={errors.description}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Harga"
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('price', e.target.value)}
                                        placeholder="25000"
                                        min="0"
                                        step="1000"
                                        error={errors.price}
                                    />

                                    <Select
                                        label="Kategori"
                                        required
                                        value={formData.category}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('category', e.target.value)}
                                        options={categories}
                                        error={errors.category}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Pengaturan Menu</h2>

                            <div className="space-y-6">
                                <Toggle
                                    label="Menu Pedas"
                                    checked={formData.isSpicy}
                                    onChange={(checked) => handleInputChange('isSpicy', checked)}
                                    description="Tandai jika menu ini memiliki level kepedasan"
                                />

                                <Toggle
                                    label="Tersedia"
                                    checked={formData.isAvailable}
                                    onChange={(checked) => handleInputChange('isAvailable', checked)}
                                    description="Menu akan tersedia untuk dipesan"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <ImageUpload
                                onImageChange={handleImageChange}
                                preview={imagePreview}
                                error={errors.image}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
