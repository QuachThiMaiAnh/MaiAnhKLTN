import React, { useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import useVoucher from "@/common/hooks/useVouher"
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from "date-fns"
import { Calendar as CalendarIcon, CircleX, PencilLine, Trash } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SheetClose } from '@/components/ui/sheet';

interface VoucherItem {
    code: string; // Mã voucher
    category: 'product' | 'ship'; // Loại voucher
    discount: number; // Mức giảm giá
    countOnStock: number; // Số lượng voucher có sẵn
    dob: { 
        from: Date | string; // Ngày bắt đầu
        to: Date | string; // Ngày kết thúc
    };
    type: 'percent' | 'fixed'; // Kiểu giảm giá
}


const voucherSchema = Joi.object({
    code: Joi.string().min(1).max(255).required().messages({
        'any.required': 'Mã Voucher là bắt buộc',
        'string.min': 'Mã Voucher phải có ít nhất 1 ký tự',
        'string.max': 'Mã Voucher tối đa 255 ký tự',
        'string.empty': 'Mã Voucher không được để trống'
    }),
    category: Joi.string().valid('product', 'ship').default('product'),
    discount: Joi.number()
        .required()
        .when('type', {
            is: 'percent',
            then: Joi.number().min(1).max(100).messages({
                'number.min': 'Giảm giá phải lớn hơn 0 khi kiểu là phần trăm (%)',
                'number.max': 'Giảm giá phải nhỏ hơn hoặc bằng 100 khi kiểu là phần trăm (%)'
            }),
            otherwise: Joi.number().min(1).messages({
                'number.min': 'Giảm giá phải lớn hơn 0 khi kiểu là cố định'
            })
        })
        .messages({
            'any.required': 'Giảm giá là bắt buộc',
            'number.base': 'Giảm giá phải là số',
        }),
    countOnStock: Joi.number().min(1).required().messages({
        'any.required': 'Số lượng là bắt buộc',
        'number.base': 'Số lượng phải là số',
    }),
    dob: Joi.object({
        from: Joi.date()
            .required().messages({
                'any.required': 'Ngày bắt đầu là bắt buộc',
                'date.base': 'Ngày bắt đầu phải là ngày hợp lệ',
            }),
        to: Joi.date()
            .required().messages({
                'any.required': 'Ngày kết thúc là bắt buộc',
                'date.base': 'Ngày kết thúc phải là ngày hợp lệ',
            }),
    }).required().messages({
        'any.required': 'Ngày hết hạn là bắt buộc',
    }),
    type: Joi.string().valid("percent", "fixed").required().empty('').messages({
        'any.required': 'Kiểu là bắt buộc',
        'string.valid': 'Kiểu không hợp lệ',
        'string.empty': 'Kiểu không được để trống'
    }),
})

const VoucherForm = ({ id }: { id: string }) => {
    const { getVoucher, updateVoucher, deleteVoucher } = useVoucher();
    const { data, isLoading, isError } = getVoucher('get-one', id)
    const { register, control, handleSubmit, formState: { errors }, reset, setValue } = useForm<VoucherItem>({
        resolver: joiResolver(voucherSchema),
    })

    const [date, setDate] = React.useState<DateRange | undefined>()
    const [status, setStatus] = useState<string>('')

    useEffect(() => {
        if (data) {
            reset({
                code: data.code,
                category: 'product',
                discount: data.discount,
                countOnStock: data.countOnStock,
                type: data.type
            })
            setDate({ from: new Date(data.startDate), to: new Date(data.endDate) })
            setStatus(data.status)
        } else return
    }, [data, reset])

    useEffect(() => {
        if (date?.from || date?.to) {
            setValue('dob', { from: date.from ?? '', to: date.to ?? "" });
        } else {
            setValue('dob',  { from: '', to: '' })
        }

    }, [date, setValue, data]);

    const [openDate, setOpenDate] = useState<string | number | null>(null)
    const [openEdit, setOpenEdit] = useState<string | number | null>(null)

    function handleOpenDate(id: string | number) {
        if (openDate === id) {
            setOpenDate(null)
        } else {
            setOpenDate(id)
        }
    }

    function handleOpenEdit(id: string | number) {
        if (openEdit === id) {
            setOpenEdit(null)
        } else {
            setOpenEdit(id)
        }
    }

    function handleDelete() {
        const item = {
            _id: id
        }
        deleteVoucher.mutate(item, {
            onSuccess: () => {
                toast({
                    title: 'Thành công',
                    description: 'Xóa thành công'
                })
            }
        })
    }

    function onSubmit(item: VoucherItem) {
        const startDateUTC = new Date(data.startDate).toISOString();
        const dobFromUTC = new Date(new Date(item.dob.from).getTime()).toISOString();

        const endDateUTC = new Date(data.endDate).toISOString();
        const dobToUTC = new Date(new Date(item.dob.to).getTime()).toISOString();

        const info = {
            ...item,
            _id: id,
            status: status,
            startDate: startDateUTC === dobFromUTC ? data.startDate : new Date(new Date(item.dob.from).getTime() + 7 * 60 * 60 * 1000),
            endDate: endDateUTC === dobToUTC ? data.endDate : new Date(new Date(item.dob.to).getTime() + 7 * 60 * 60 * 1000),
        }
        const { dob, ...data2 } = info

        console.log(dob)
        updateVoucher.mutate(data2, {
            onSuccess: () => {
                toast({
                    title: 'Thành công',
                    description: 'Cập nhật thành công'
                })
            }
        })
        // console.log(data2)
    }

    if (isLoading) <div>Is Loading...</div>
    if (isError) <div>Is Error....</div>

    return (
        <div className='mt-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    {errors?.code?.message ? <Label htmlFor="code" className='text-red-500'>Mã code</Label> : <Label htmlFor="code" >Mã code</Label>}
                    <Input
                        disabled={openEdit === id ? false : true}
                        placeholder='Code...'
                        className='mb-0'
                        {...register('code', { required: true, minLength: 3, maxLength: 255 })}
                    />
                    {errors?.code?.message && <span className='text-red-500'>{errors?.code?.message.toString()}</span>}
                </div>

                {/* <div className='flex flex-col gap-2 *:w-full'>
                    {errors?.category?.message ? <Label htmlFor="category" className='text-red-500'>Loại</Label> : <Label htmlFor="category" >Loại</Label>}
                    <Controller
                        control={control}
                        name="category"
                        defaultValue=""
                        render={({ field }) => (
                            <Select disabled={openEdit === id ? false : true} onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-[180px] m-0">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="product">Sản phẩm</SelectItem>
                                        <SelectItem value="ship">Ship</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors?.category?.message && <span className='text-red-500'>{errors?.category?.message.toString()}</span>}
                </div> */}

                <div className='flex flex-col gap-2'>
                    {errors?.discount?.message ? <Label htmlFor="discount" className='text-red-500'>Giảm giá</Label> : <Label htmlFor="discount" >Giảm giá</Label>}
                    <Input
                        disabled={openEdit === id ? false : true}
                        placeholder='Giảm...'
                        className='mb-0'
                        {...register('discount', { required: true, minLength: 3, maxLength: 255 })}
                    />
                    {errors?.discount?.message && <span className='text-red-500'>{errors?.discount?.message.toString()}</span>}
                </div>

                <div className='flex flex-col gap-2'>
                    {errors?.countOnStock?.message ? <Label htmlFor="countOnStock" className='text-red-500'>Số lượng</Label> : <Label htmlFor="countOnStock" >Số lượng</Label>}
                    <Input
                        disabled={openEdit === id ? false : true}
                        placeholder='Số lượng...'
                        className='mb-0'
                        {...register('countOnStock', { required: true, minLength: 3, maxLength: 255 })}
                    />
                    {errors?.countOnStock?.message && <span className='text-red-500'>{errors?.countOnStock?.message.toString()}</span>}
                </div>

                <div className='flex flex-col gap-2 *:w-full'>
                    {errors?.type?.message ? <Label htmlFor="type" className='text-red-500'>Kiểu</Label> : <Label htmlFor="type" >Kiểu</Label>}
                    <Controller
                        control={control}
                        name="type"
                        defaultValue={undefined}
                        render={({ field }) => (
                            <Select disabled={openEdit === id ? false : true} onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-[180px] m-0">
                                    <SelectValue placeholder="Chọn kiểu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="percent">Phần trăm (%)</SelectItem>
                                        <SelectItem value="fixed">Trực tiếp (VNĐ)</SelectItem>
                                        {/* <SelectItem value="test">Test</SelectItem> */}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors?.type?.message && <span className='text-red-500'>{errors?.type?.message.toString()}</span>}
                </div>

                <div className='relative select-none z-50'>
                    {errors?.dob ? <Label htmlFor="dob" className='text-red-500'>Hạn sử dụng</Label> : <Label htmlFor="dob" >Hạn sử dụng</Label>}
                    <div onClick={() => openEdit === id && handleOpenDate(id)} className={`flex items-center border rounded-md px-4 py-2 ${openEdit === id ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                        <CalendarIcon size={20} className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Chọn ngày</span>
                        )}
                    </div >
                    <div className={`flex absolute bg-white top-[70px] transition-all duration-200 ${openDate === id ? '' : 'opacity-0 z-[-1] scale-75 hidden'}`}>
                        <div className='border rounded-md'>
                            <Calendar
                                disabled={openEdit === id ? false : true}
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                            />
                        </div>
                    </div>
                    {errors?.dob?.message && <span className='text-red-500'>{errors?.dob?.message.toString()}</span>}
                    {errors?.dob?.to?.message && <span className='text-red-500'>{errors?.dob?.to?.message.toString()}</span>}
                    {errors?.dob?.from?.message && <span className='text-red-500'>{errors?.dob?.from?.message.toString()}</span>}
                </div>

                <div className='flex flex-col gap-2 *:w-full'>
                    <Label htmlFor="status" >Trạng thái</Label>
                    <div className={`select-none rounded-md bg-[#F4F4F5] p-1 ${openEdit === id ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                        <div className='grid grid-cols-[50%_50%] relative w-full rounded-sm *:text-sm *:py-1.5 *:font-medium *:text-center *:rounded-sm'>
                            <div className={`bg-white w-1/2 absolute h-full z-10 transition-all duration-200 ${status === 'active' ? 'left-0' : 'left-1/2'}`}></div>
                            <div onClick={() => openEdit === id && setStatus('active')} className={`z-20 ${status === 'active' ? ' text-black shadow-sm' : 'text-[#71717A]'}`}>Kích hoạt</div>
                            <div onClick={() => openEdit === id && setStatus('inactive')} className={`z-20 ${status === 'inactive' ? ' text-black shadow-sm' : 'text-[#71717A]'}`}>Đóng</div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-between select-none'>
                    {openEdit === id ?
                        <>
                            <Button type='submit'>Lưu</Button>
                            <div
                                onClick={() => handleOpenEdit(id)}
                                className='flex text-red-500 transition-all duration-200 hover:bg-red-50 rounded-md px-2 py-1 items-center gap-1 cursor-pointer select-none'
                            >
                                <CircleX size={16} />
                                <span>Hủy</span>
                            </div>
                        </>
                        :
                        <>
                            <div
                                className='flex text-red-500 transition-all duration-200 hover:bg-red-50 rounded-md px-2 py-1 items-center gap-1 cursor-pointer select-none'
                            >
                                {/* <Trash size={16} className='mb-1' />
                                <span>Delete</span> */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div
                                            className='flex text-red-500 transition-all duration-200 hover:bg-red-50 rounded-md px-2 py-1 items-center gap-1 cursor-pointer select-none'
                                        >
                                            <Trash size={16} className='mb-1' />
                                            <span>Xóa</span>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Bạn chắc chứ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Voucher sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                            <SheetClose asChild>
                                                <AlertDialogAction onClick={() => handleDelete()}>Tiếp tục</AlertDialogAction>
                                            </SheetClose>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <div
                                onClick={() => handleOpenEdit(id)}
                                className='flex items-center gap-2 px-2 py-1 border transition-all duration-200 rounded-md shadow-sm hover:border-black cursor-pointer'
                            >
                                <PencilLine size={16} />
                                <span>Sửa</span>
                            </div>
                        </>
                    }

                </div>
            </form >
        </div >
    )
}

export default VoucherForm