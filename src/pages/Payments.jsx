"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StatusBadge from "@/components/ui/StatusBadge"
import { useTransactions } from "@/hooks/useTransactions"
import { formatCurrency } from "@/lib/utils"

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { transactions, isLoading } = useTransactions()

  // Filter transactions by search term
  const filteredTransactions = searchTerm
    ? transactions.filter(
        (transaction) =>
          transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : transactions

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search transactions..."
            className="w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="booking">Booking</SelectItem>
              <SelectItem value="package">Package</SelectItem>
              <SelectItem value="coaching">Coaching</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Export Transactions</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage all payment transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-[300px]" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.user}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          {transaction.status === "completed" && <DropdownMenuItem>Process Refund</DropdownMenuItem>}
                          {transaction.status === "pending" && <DropdownMenuItem>Mark as Completed</DropdownMenuItem>}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Payments

