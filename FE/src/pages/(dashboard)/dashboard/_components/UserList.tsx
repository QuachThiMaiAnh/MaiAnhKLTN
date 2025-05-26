import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function UserList() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['UserList'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8080/api/dashboard/get-data-user-list')
            return data
        }
    })

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>Khách hàng tiềm năng</CardTitle>
                <CardDescription>
                    Top 5 khách hàng đã mua hàng và chi tiêu nhiều nhất.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {data?.map((user: any) => (
                        <Link to={`users/detail/${user.clerkId}`} >
                            <div key={user._id} className='flex items-center gap-4 rounded-md hover:bg-gray-100 py-4 px-1 cursor-pointer group transition-all duration-200'>
                                <Avatar className='h-9 w-9'>
                                    <AvatarImage src={user.userAvatar ? user.userAvatar : 'https://github.com/shadcn.png'} alt='Avatar' />
                                    <AvatarFallback>{user.userName ? user.userName : 'Ẩn danh'}</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-1 flex-wrap items-center justify-between'>
                                    <div className='space-y-1'>
                                        <p className='text-sm font-medium leading-none group-hover:text-blue-500'>{user.userName ? user.userName : 'Ẩn danh'}</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {user.userEmail}
                                        </p>
                                    </div>
                                    <div className='font-medium'>{formatCurrency(user.totalSpent)} VNĐ</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
