import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { throttle } from 'lodash'
import { useMe } from '@/lib/store/meStore.ts'
import { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'

export const UserNav = memo(() => {
  const { user, updateUser } = useMe(state => state)

  const logout = throttle(() => {
    localStorage.clear()

    window.location.reload()
  }, 200)

  useEffect(() => {
    if (!user) {
      updateUser()
    }
  }, [user])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profilePicture} alt="@shadcn" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p
              className="text-sm font-medium leading-none">{user?.firstName ? user?.firstName + ' ' + (user?.lastName ?? '') : user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={'/setting/profile'}>
            <DropdownMenuItem>
              Thông tin cá nhân
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          {/*<Link to={'/settings/billing'}>*/}
          {/*  <DropdownMenuItem>*/}
          {/*    Quản lý giao dịch*/}
          {/*    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>*/}
          {/*  </DropdownMenuItem>*/}
          {/*</Link>*/}
          {/*<Link to={'/settings'}>*/}
          {/*  <DropdownMenuItem>*/}
          {/*    Cài đặt*/}
          {/*    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
          {/*  </DropdownMenuItem>*/}
          {/*</Link>*/}
          {/*<Link to={'/contribute/bug-report'}>*/}
          {/*  <DropdownMenuItem>Báo lỗi</DropdownMenuItem>*/}
          {/*</Link>*/}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Đăng xuất
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
