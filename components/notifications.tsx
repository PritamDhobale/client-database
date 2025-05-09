"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Clock, FileText, User, Calendar, DollarSign, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)
      if (!error && data) {
        setNotifications(data)
      } else {
        console.error("Fetch notifications error", error)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const clearNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "agreement":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "client":
        return <User className="h-4 w-4 text-green-500" />
      case "service":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "financial":
        return <DollarSign className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              <Check className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">No notifications</div>
        ) : (
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn("flex flex-col items-start p-3 cursor-pointer", !notification.read && "bg-primary/5")}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex w-full justify-between">
                  <div className="flex items-center">
                    {getNotificationIcon(notification.type)}
                    <span className={cn("ml-2 font-medium", !notification.read && "text-primary")}>
                      {notification.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-50 hover:opacity-100"
                    onClick={(e) => clearNotification(notification.id, e)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                <div className="flex items-center text-xs text-gray-400 mt-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(notification.created_at).toLocaleString()}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm text-primary cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
