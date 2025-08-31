import {DotsHorizontalIcon} from '@radix-ui/react-icons'
import {Row} from '@tanstack/react-table'

import {Button} from '@/components/custom/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {Link} from "react-router-dom";
import {RepositoryFactory} from '@/api/repository-factory';
import {AxiosResponse, HttpStatusCode} from 'axios';
import {toast} from '@/components/ui/use-toast';
import {useState} from 'react';
import {NumberParam, useQueryParam} from 'use-query-params';
import {useUser} from "@/lib/store/userStore.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const UserRepository = RepositoryFactory.get('user')

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({row}: DataTableRowActionsProps<TData>) {
    const [v, setV] = useQueryParam('v', NumberParam);
    const {setChangePlanData} = useUser();
    const d: any = row.original;
    const [loading, setLoading] = useState(false);
    const [openChangeLicenseKey, setOpenLicenseKey] = useState(false);

    const lockUser = () => {
        if (loading) return;
        setLoading(true)
        UserRepository.lock(d.id)
            .then((resp: AxiosResponse) => {
                if (resp.status === HttpStatusCode.Ok) {
                    toast({
                        title: 'Khóa người dùng thành công'
                    })
                    setV((v ?? 0) + 1)
                } else {
                    toast({
                        title: 'Khóa người dùng thất bại. Vui lòng thử lại',
                        variant: 'destructive'
                    })
                }
            }).catch(() => {
            toast({
                title: 'Khóa người dùng thất bại. Vui lòng thử lại',
                variant: 'destructive'
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const unlockUser = () => {
        if (loading) return;
        setLoading(true)
        UserRepository.unlock(d.id)
            .then((resp: AxiosResponse) => {
                if (resp.status === HttpStatusCode.Ok) {
                    toast({
                        title: 'Mở khóa người dùng thành công'
                    })
                    setV((v ?? 0) + 1)
                } else {
                    toast({
                        title: 'Mở khóa người dùng thất bại. Vui lòng thử lại',
                        variant: 'destructive'
                    })
                }
            }).catch(() => {
            toast({
                title: 'Mở khóa người dùng thất bại. Vui lòng thử lại',
                variant: 'destructive'
            })
        }).finally(() => {
            setLoading(false)
        })
    }

  const updateLicenseKey = () => {
    if (loading) return;
    setLoading(true)
    UserRepository.updateLicenseKey(d.id)
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          toast({
            title: 'Cập nhật mã license người dùng thành công'
          })
          setV((v ?? 0) + 1)
        } else {
          toast({
            title: 'Cập nhật mã người dùng thất bại. Vui lòng thử lại',
            variant: 'destructive'
          })
        }
      }).catch(() => {
      toast({
        title: 'Cập nhật mã người dùng thất bại. Vui lòng thử lại',
        variant: 'destructive'
      })
    }).finally(() => {
      setLoading(false)
    })
  }

    return (
      <>
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                >
                    <DotsHorizontalIcon className='h-4 w-4'/>
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[260px]'>
                <DropdownMenuItem asChild>
                    <Link to={`/user/log/${row.getValue('username')}`}>
                        Xem log gửi tin nhắn
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to={`/user/${row.getValue('id')}`}>
                        Xem lịch sử hoạt động
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => {
                    setChangePlanData(d)
                }}>
                    Cập nhật license cho người dùng
                </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenLicenseKey(true)}>
                Cập nhật mã license
              </DropdownMenuItem>
                <DropdownMenuSeparator/>
                {d.status === 'ACTIVE' ? <DropdownMenuItem onClick={lockUser}>
                        Khóa người dùng
                    </DropdownMenuItem>
                    : <DropdownMenuItem onClick={unlockUser}>
                        Mở khóa người dùng
                    </DropdownMenuItem>}
            </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={openChangeLicenseKey} onOpenChange={setOpenLicenseKey}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắn chắn muốn cập nhật mã của người dùng này?</AlertDialogTitle>
              <AlertDialogDescription>
                Khi cập nhật mã của người dùng này. Mã cũ sẽ hết hạn ngay lập tức.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Đóng</AlertDialogCancel>
              <AlertDialogAction onClick={updateLicenseKey}>Tiếp tục</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
