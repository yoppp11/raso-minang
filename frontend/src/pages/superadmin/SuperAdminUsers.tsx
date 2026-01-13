import { useState, useEffect } from "react"
import { Search, UserPlus, Trash2, Shield, User as UserIcon } from "lucide-react"
import Swal from "sweetalert2"
import { http } from "../../helpers/axios"
import { User, PaginationData } from "../../types"

export default function SuperAdminUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("")
    const [page, setPage] = useState(1)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newAdmin, setNewAdmin] = useState({
        username: "",
        email: "",
        password: "",
        full_name: "",
        phone_number: "",
        role: "admin"
    })

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (roleFilter) params.append('role', roleFilter)
            params.append('page', page.toString())
            params.append('limit', '10')

            const response = await http({
                method: 'get',
                url: `/superadmin/users?${params.toString()}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            })
            setUsers(response.data.data.users)
            setPagination(response.data.data.pagination)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, roleFilter, page])

    const handleUpdateRole = async (userId: number, newRole: string) => {
        const result = await Swal.fire({
            title: 'Update Role?',
            text: `Are you sure you want to change this user's role to ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280'
        })

        if (result.isConfirmed) {
            try {
                await http({
                    method: 'patch',
                    url: `/superadmin/users/${userId}/role`,
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    },
                    data: { role: newRole }
                })
                Swal.fire('Success!', 'User role updated successfully', 'success')
                fetchUsers()
            } catch (error: unknown) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                Swal.fire('Error!', axiosError.response?.data?.message || 'Failed to update role', 'error')
            }
        }
    }

    const handleDeleteUser = async (userId: number) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280'
        })

        if (result.isConfirmed) {
            try {
                await http({
                    method: 'delete',
                    url: `/superadmin/users/${userId}`,
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                })
                Swal.fire('Deleted!', 'User has been deleted', 'success')
                fetchUsers()
            } catch (error: unknown) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                Swal.fire('Error!', axiosError.response?.data?.message || 'Failed to delete user', 'error')
            }
        }
    }

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await http({
                method: 'post',
                url: '/superadmin/users/admin',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                data: newAdmin
            })
            Swal.fire('Success!', 'Admin created successfully', 'success')
            setShowAddModal(false)
            setNewAdmin({
                username: "",
                email: "",
                password: "",
                full_name: "",
                phone_number: "",
                role: "admin"
            })
            fetchUsers()
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } }
            Swal.fire('Error!', axiosError.response?.data?.message || 'Failed to create admin', 'error')
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'bg-purple-100 text-purple-700'
            case 'admin':
                return 'bg-orange-100 text-orange-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                    <UserPlus className="h-5 w-5" />
                    Add Admin
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Phone</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    user.role === 'superadmin' ? 'bg-purple-100' :
                                                    user.role === 'admin' ? 'bg-orange-100' : 'bg-gray-100'
                                                }`}>
                                                    {user.role === 'superadmin' || user.role === 'admin' ? (
                                                        <Shield className={`h-5 w-5 ${
                                                            user.role === 'superadmin' ? 'text-purple-600' : 'text-orange-600'
                                                        }`} />
                                                    ) : (
                                                        <UserIcon className="h-5 w-5 text-gray-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.full_name || user.username}</p>
                                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.phone_number || '-'}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)} border-0 cursor-pointer`}
                                                disabled={user.role === 'superadmin'}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="superadmin">Super Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={user.role === 'superadmin'}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Admin</h2>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={newAdmin.username}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={newAdmin.full_name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={newAdmin.phone_number}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, phone_number: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={newAdmin.role}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
