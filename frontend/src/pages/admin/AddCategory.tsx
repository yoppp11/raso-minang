import { useState } from "react"
import { ArrowLeft, Save, Tag, X } from "lucide-react"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { useNavigate } from "react-router"
import Card from "../../components/admin/Card"
import Button from "../../components/admin/Button"

interface CategoryFormData {
  name: string
  description: string
}

interface FormErrors {
  name?: string
  description?: string
}

export default function AddCategoryPage() {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: ""
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama kategori wajib diisi"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nama kategori minimal 2 karakter"
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Nama kategori maksimal 50 karakter"
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi kategori wajib diisi"
    } else if (formData.description.trim().length < 5) {
      newErrors.description = "Deskripsi minimal 5 karakter"
    } else if (formData.description.trim().length > 200) {
      newErrors.description = "Deskripsi maksimal 200 karakter"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const response = await http({
        method: 'POST',
        url: '/categories',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: formData.name.trim(),
          description: formData.description.trim()
        }
      })

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori baru berhasil ditambahkan',
        timer: 2000,
        showConfirmButton: false
      })

      navigate('/admin/category')
    } catch (error: any) {
      console.error('Error creating category:', error)
      
      let errorMessage = 'Gagal menambahkan kategori. Silakan coba lagi.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 409) {
        errorMessage = 'Nama kategori sudah ada. Gunakan nama lain.'
      }

      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (formData.name.trim() || formData.description.trim()) {
      Swal.fire({
        title: 'Batalkan Perubahan?',
        text: 'Data yang sudah diisi akan hilang',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#16a34a',
        confirmButtonText: 'Ya, Batalkan',
        cancelButtonText: 'Lanjut Edit'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/admin/category')
        }
      })
    } else {
      navigate('/admin/category')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Tambah Kategori Baru
              </h1>
              <p className="text-gray-600 mt-1">
                Isi informasi kategori yang akan ditambahkan
              </p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`
                      block w-full pl-10 pr-3 py-3 border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600
                      ${errors.name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white'
                      }
                    `}
                    placeholder="Masukkan nama kategori"
                    maxLength={50}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.name.length}/50 karakter
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Kategori
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`
                    block w-full px-3 py-3 border rounded-lg resize-none
                    focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600
                    ${errors.description 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-white'
                    }
                  `}
                  placeholder="Masukkan deskripsi kategori"
                  maxLength={200}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.description}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.description.length}/200 karakter
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-600 order-1 sm:order-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Kategori
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <Card className="mt-6">
          <div className="p-4 bg-green-50 border-l-4 border-green-600">
            <div className="flex">
              <div className="flex-shrink-0">
                <Tag className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Tips Membuat Kategori
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Gunakan nama yang jelas dan mudah dipahami</li>
                    <li>Deskripsi yang informatif membantu pengelolaan menu</li>
                    <li>Hindari nama kategori yang terlalu panjang</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}