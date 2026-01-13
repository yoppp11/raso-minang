import React, { useState, ChangeEvent } from 'react'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router'
import { http } from '../../helpers/axios'
import Swal from 'sweetalert2'

interface FormData {
    name: string
    description: string
}

interface FormErrors {
    name?: string
    description?: string
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

export default function SuperAdminAddCategory() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: ''
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Basic validation
        const newErrors: FormErrors = {}
        if (!formData.name.trim()) {
            newErrors.name = 'Nama kategori wajib diisi'
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)

        try {
            await http({
                method: 'post',
                url: '/categories',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                data: {
                    name: formData.name,
                    description: formData.description
                }
            })

            Swal.fire({
                title: 'Berhasil',
                text: 'Kategori baru berhasil ditambahkan',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/superadmin/categories')
            })
        } catch (error) {
            console.error('Error:', error)
            Swal.fire({
                title: 'Terjadi Kesalahan',
                text: 'Gagal menambahkan kategori. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/superadmin/categories')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Kategori Baru</h1>
                    <p className="text-sm text-gray-600">Tambahkan kategori baru untuk menu</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <Input
                            label="Nama Kategori"
                            required
                            value={formData.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                            placeholder="Contoh: Lauk Pauk"
                            error={errors.name}
                        />

                        <TextArea
                            label="Deskripsi"
                            value={formData.description}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                            placeholder="Deskripsi kategori (opsional)"
                            rows={3}
                            error={errors.description}
                        />

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
                                    Simpan Kategori
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
