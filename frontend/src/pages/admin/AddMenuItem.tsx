import React, { useState, ChangeEvent, DragEvent, JSX } from 'react'
import { ArrowLeft, Upload, X, Save, Eye, AlertCircle, LucideIcon } from 'lucide-react'
import Button from '../../components/admin/Button'

// Types
interface SelectOption {
  value: string
  label: string
}

interface FormData {
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

// Component Props Interfaces
interface CardProps {
  children: React.ReactNode
  className?: string
}

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

interface InputProps {
  label?: string
  error?: string
  required?: boolean
  className?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  min?: string
  step?: string
}

interface TextAreaProps {
  label?: string
  error?: string
  required?: boolean
  className?: string
  rows?: number
  value?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
}

interface SelectProps {
  label?: string
  error?: string
  required?: boolean
  options?: SelectOption[]
  className?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
}

interface ImageUploadProps {
  onImageChange: (file: File | null) => void
  preview: string | null
  error?: string
}

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

// Reusable Components
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
)

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  required = false, 
  className = "",
  ...props 
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
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

const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  error, 
  required = false, 
  className = "",
  rows = 4,
  ...props 
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical ${
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

const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  required = false, 
  options = [], 
  className = "",
  ...props 
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
        error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
      }`}
      {...props}
    >
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

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, preview, error }) => {
  const [dragActive, setDragActive] = useState<boolean>(false)

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
        Gambar Menu <span className="text-red-500">*</span>
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-green-400 bg-green-50' 
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
              <label className="text-green-600 hover:text-green-700 cursor-pointer font-medium">
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

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, description }) => (
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          checked ? 'bg-green-600' : 'bg-gray-200'
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

// Main Component
export default function AddMenuPage(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const categories: SelectOption[] = [
    { value: '', label: 'Pilih Kategori' },
    { value: 'Lauk Pauk', label: 'Lauk Pauk' },
    { value: 'Gulai', label: 'Gulai' },
    { value: 'Sambal', label: 'Sambal' },
    { value: 'Sayuran', label: 'Sayuran' },
    { value: 'Minuman', label: 'Minuman' }
  ]

  const handleInputChange = (field: keyof FormData, value: string | boolean | File | null): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageChange = (file: File | null): void => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = (): void => {
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama menu wajib diisi'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi menu wajib diisi'
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga harus lebih dari 0'
    }
    
    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih'
    }
    
    if (!formData.image) {
      newErrors.image = 'Gambar menu wajib diupload'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Here you would normally make the API call
      console.log('Form Data:', formData)
      
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
        isSpicy: false,
        isAvailable: true
      })
      setImagePreview(null)
      
      alert('Menu berhasil ditambahkan!')
      
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat menambahkan menu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    console.log('Preview menu:', formData)
    alert('Fitur preview akan ditampilkan di modal')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Tambah Menu Baru</h1>
                <p className="text-sm text-gray-600">Tambahkan menu baru ke dalam daftar menu Raso Minang</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Menu
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Informasi Menu</h2>
                  
                  <div className="space-y-6">
                    <Input
                      label="Nama Menu"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Contoh: Rendang Daging"
                      error={errors.name}
                    />
                    
                    <TextArea
                      label="Deskripsi Menu"
                      required
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
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
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="25000"
                        min="0"
                        step="1000"
                        error={errors.price}
                      />
                      
                      <Select
                        label="Kategori"
                        required
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        options={categories}
                        error={errors.category}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
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
                      description="Menu akan langsung tersedia untuk dipesan"
                    />
                  </div>
                </Card>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-6">
                <Card className="p-6">
                  <ImageUpload
                    onImageChange={handleImageChange}
                    preview={imagePreview}
                    error={errors.image}
                  />
                </Card>

                {/* Preview Card */}
                {(formData.name || formData.price || imagePreview) && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Menu</h3>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      {imagePreview && (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {formData.name || 'Nama Menu'}
                            {formData.isSpicy && (
                              <span className="ml-2 text-red-500 text-xs">🌶️ Pedas</span>
                            )}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            formData.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {formData.isAvailable ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>
                        {formData.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {formData.description}
                          </p>
                        )}
                        {formData.price && (
                          <p className="text-lg font-semibold text-gray-900">
                            Rp {parseInt(formData.price).toLocaleString('id-ID')}
                          </p>
                        )}
                        {formData.category && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {formData.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}