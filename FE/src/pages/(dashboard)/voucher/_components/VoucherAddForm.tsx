import React, { useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import useVoucher from "@/common/hooks/useVouher"
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from "date-fns"
import { Calendar as CalendarIcon, CircleX } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { DialogClose } from '@/components/ui/dialog';
interface VoucherForm {
    code: string;
    category: "product" | "ship";
    discount: string;
    countOnStock: string;
    dob: {
      from: Date | undefined;
      to: Date | undefined;
    };
    type: "percent" | "fixed";
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

const VoucherAddForm = () => {
    const { createVoucher } = useVoucher();
    const { register, control, handleSubmit, formState: { errors }, reset, setValue } = useForm<VoucherForm>({
        resolver: joiResolver(voucherSchema),
    })

    const [date, setDate] = React.useState<DateRange | undefined>()
    const [status, setStatus] = useState<string>('')

    const [openDate, setOpenDate] = useState<string | number | null>(null)

    useEffect(() => {
        reset({
            code: '',
            category: 'product',
            discount: '',
            countOnStock: '',
            dob: {
                from: undefined,
                to: undefined
            },
            type: 'fixed'
        })
        setStatus('inactive')
    }, [])

    useEffect(() => {
        if (date?.from || date?.to) {
            setValue('dob', { from: date.from || undefined, to: date.to || undefined });
        } else {
            setValue('dob', { from: undefined, to: undefined })
        }

    }, [date, setValue]);

    function handleOpenDate(id: string | number) {
        if (openDate === id) {
            setOpenDate(null)
        } else {
            setOpenDate(id)
        }
    }

    function onSubmit(data: VoucherForm) {
        const info = {
            ...data,
            category: 'product',
            status: status,
            startDate: data.dob?.from ? new Date(new Date(data.dob.from).getTime() + 7 * 60 * 60 * 1000) : undefined,
            endDate: data.dob?.to ? new Date(new Date(data.dob.to).getTime() + 7 * 60 * 60 * 1000) : undefined
        }
        const { dob, ...item } = info
        console.log(dob)
        createVoucher.mutate(item, {
            onSuccess: () => {
                toast({
                    title: "Thành công",
                    description: "Tạo thành công",
                })
                reset()
            }
        })
    }

    return (
        <div className='mt-4'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    {errors?.code?.message ? <Label htmlFor="code" className='text-red-500'>Mã Voucher</Label> : <Label htmlFor="code" >Mã Voucher</Label>}
                    <Input
                        placeholder='Mã...'
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
                        defaultValue="product"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-[180px] mt-0">
                                    <SelectValue placeholder="Chọn loại Voucher" />
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
                        placeholder='Giảm giá...'
                        className='mb-0'
                        {...register('discount', { required: true })}
                    />
                    {errors?.discount?.message && <span className='text-red-500'>{errors?.discount?.message.toString()}</span>}
                </div>

                <div className='flex flex-col gap-2'>
                    {errors?.countOnStock?.message ? <Label htmlFor="countOnStock" className='text-red-500'>Số lượng</Label> : <Label htmlFor="countOnStock" >Số lượng</Label>}
                    <Input
                        placeholder='Số lượng...'
                        className='mb-0'
                        {...register('countOnStock', { required: true })}
                    />
                    {errors?.countOnStock?.message && <span className='text-red-500'>{errors?.countOnStock?.message.toString()}</span>}
                </div>

                <div className='relative select-none z-50'>
                    {errors?.dob ? <Label htmlFor="dob" className='text-red-500'>Hạn sử dụng</Label> : <Label htmlFor="dob" >Hạn sử dụng</Label>}
                    <div onClick={() => handleOpenDate(1)} className={`flex items-center border rounded-md px-4 py-2 cursor-pointer`}>
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
                    <div className={`flex absolute bg-white top-[70px] transition-all duration-200 ${openDate === 1 ? '' : 'opacity-0 z-[-1] scale-75 hidden'}`}>
                        <div className='border rounded-md'>
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={new Date()}
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
                    {errors?.type?.message ? <Label htmlFor="type" className='text-red-500'>Kiểu</Label> : <Label htmlFor="type" >Kiểu</Label>}
                    <Controller
                        control={control}
                        name="type"
                        defaultValue="fixed"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-[180px] mt-0">
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

                <div className='flex flex-col gap-2 *:w-full'>
                    <Label htmlFor="status" >Trạng thái</Label>
                    <div className={`select-none rounded-md bg-[#F4F4F5] p-1 cursor-pointer`}>
                        <div className='grid grid-cols-[50%_50%] relative w-full rounded-sm *:text-sm *:py-1.5 *:font-medium *:text-center *:rounded-sm'>
                            <div className={`bg-white w-1/2 absolute h-full z-10 transition-all duration-200 ${status === 'active' ? 'left-0' : 'left-1/2'}`}></div>
                            <div onClick={() => setStatus('active')} className={`z-20 ${status === 'active' ? ' text-black shadow-sm' : 'text-[#71717A]'}`}>Kích hoạt</div>
                            <div onClick={() => setStatus('inactive')} className={`z-20 ${status === 'inactive' ? ' text-black shadow-sm' : 'text-[#71717A]'}`}>Đóng</div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-between select-none'>
                    <Button type='submit'>Lưu</Button>
                    <DialogClose asChild>
                        <div
                            className='flex text-red-500 transition-all duration-200 hover:bg-red-50 rounded-md px-2 py-1 items-center gap-1 cursor-pointer select-none'
                        >
                            <CircleX size={16} />
                            <span>Hủy</span>
                        </div>
                    </DialogClose>
                </div>
            </form >
        </div >
    )
}

export default VoucherAddForm