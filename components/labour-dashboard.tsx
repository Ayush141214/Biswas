"use client"

import { useState } from "react"
import { Search, Download, Plus, LogOut, Calendar, Users, Clock, Briefcase, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Labour {
  id: number
  name: string
  age: number
  contact: string
  address: string
  type: "Permanent" | "Hourly"
  hours: number
  permanentSalary: number
  hourlySalary: number
  total: number
  pending: number
}

const initialLabourData: Labour[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    age: 32,
    contact: "+91 98765 43210",
    address: "123 MG Road, Kolkata",
    type: "Permanent",
    hours: 160,
    permanentSalary: 25000,
    hourlySalary: 0,
    total: 25000,
    pending: 5000,
  },
  {
    id: 2,
    name: "Amit Singh",
    age: 28,
    contact: "+91 98765 43211",
    address: "456 Park Street, Kolkata",
    type: "Hourly",
    hours: 120,
    permanentSalary: 0,
    hourlySalary: 150,
    total: 18000,
    pending: 3000,
  },
  {
    id: 3,
    name: "Suresh Sharma",
    age: 35,
    contact: "+91 98765 43212",
    address: "789 Salt Lake, Kolkata",
    type: "Permanent",
    hours: 160,
    permanentSalary: 30000,
    hourlySalary: 0,
    total: 30000,
    pending: 0,
  },
  {
    id: 4,
    name: "Vikram Patel",
    age: 26,
    contact: "+91 98765 43213",
    address: "321 Ballygunge, Kolkata",
    type: "Hourly",
    hours: 80,
    permanentSalary: 0,
    hourlySalary: 200,
    total: 16000,
    pending: 8000,
  },
]

type FilterType = "all" | "Permanent" | "Hourly" | "liability"

export function LabourDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [labourData, setLabourData] = useState<Labour[]>(initialLabourData)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newLabour, setNewLabour] = useState({
    name: "",
    age: "",
    contact: "",
    address: "",
    type: "Permanent" as "Permanent" | "Hourly",
    hours: "",
    permanentSalary: "",
    hourlySalary: "",
    pending: "",
  })

  const filteredData = labourData.filter((labour) => {
    const matchesSearch =
      labour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      labour.contact.includes(searchQuery) ||
      labour.address.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    switch (activeFilter) {
      case "Permanent":
        return labour.type === "Permanent"
      case "Hourly":
        return labour.type === "Hourly"
      case "liability":
        return labour.pending > 0
      default:
        return true
    }
  })

  const totalLabours = labourData.length
  const permanentLabours = labourData.filter((l) => l.type === "Permanent").length
  const hourlyLabours = labourData.filter((l) => l.type === "Hourly").length
  const totalLiability = labourData.reduce((sum, l) => sum + l.pending, 0)

  const handleCardClick = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? "all" : filter)
  }

  const handleExport = () => {
    const headers = [
      "Name",
      "Age",
      "Contact",
      "Address",
      "Type",
      "Hours",
      "Permanent Salary",
      "Hourly Salary",
      "Total",
      "Pending",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredData.map((labour) =>
        [
          `"${labour.name}"`,
          labour.age,
          `"${labour.contact}"`,
          `"${labour.address}"`,
          labour.type,
          labour.hours,
          labour.permanentSalary,
          labour.hourlySalary,
          labour.total,
          labour.pending,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `labour_data_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddLabour = () => {
    const hours = Number.parseInt(newLabour.hours) || 0
    const permanentSalary = Number.parseInt(newLabour.permanentSalary) || 0
    const hourlySalary = Number.parseInt(newLabour.hourlySalary) || 0
    const pending = Number.parseInt(newLabour.pending) || 0

    const total = newLabour.type === "Permanent" ? permanentSalary : hours * hourlySalary

    const labour: Labour = {
      id: labourData.length + 1,
      name: newLabour.name,
      age: Number.parseInt(newLabour.age) || 0,
      contact: newLabour.contact,
      address: newLabour.address,
      type: newLabour.type,
      hours,
      permanentSalary: newLabour.type === "Permanent" ? permanentSalary : 0,
      hourlySalary: newLabour.type === "Hourly" ? hourlySalary : 0,
      total,
      pending,
    }

    setLabourData([...labourData, labour])
    setIsAddModalOpen(false)
    setNewLabour({
      name: "",
      age: "",
      contact: "",
      address: "",
      type: "Permanent",
      hours: "",
      permanentSalary: "",
      hourlySalary: "",
      pending: "",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-blue-600 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">BISWAS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Labour Management</h1>
              <p className="text-sm text-gray-500">BISWAS ENTERPRISES</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />
              Event Status
            </Button>
            <Button variant="outline" className="text-gray-700 bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Summary Cards - Made clickable with active state */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => handleCardClick("all")}
            className={`bg-blue-600 rounded-xl p-5 text-white flex items-center justify-between text-left transition-all ${
              activeFilter === "all" ? "ring-4 ring-blue-300 scale-[1.02]" : "hover:scale-[1.01]"
            }`}
          >
            <div>
              <p className="text-sm opacity-90">Total Labours</p>
              <p className="text-3xl font-bold">{totalLabours}</p>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </button>

          <button
            onClick={() => handleCardClick("Permanent")}
            className={`bg-orange-500 rounded-xl p-5 text-white flex items-center justify-between text-left transition-all ${
              activeFilter === "Permanent" ? "ring-4 ring-orange-300 scale-[1.02]" : "hover:scale-[1.01]"
            }`}
          >
            <div>
              <p className="text-sm opacity-90">Permanent Labours</p>
              <p className="text-3xl font-bold">{permanentLabours}</p>
            </div>
            <Briefcase className="w-12 h-12 opacity-80" />
          </button>

          <button
            onClick={() => handleCardClick("Hourly")}
            className={`bg-purple-500 rounded-xl p-5 text-white flex items-center justify-between text-left transition-all ${
              activeFilter === "Hourly" ? "ring-4 ring-purple-300 scale-[1.02]" : "hover:scale-[1.01]"
            }`}
          >
            <div>
              <p className="text-sm opacity-90">Hourly Labours</p>
              <p className="text-3xl font-bold">{hourlyLabours}</p>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </button>

          <button
            onClick={() => handleCardClick("liability")}
            className={`bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-5 text-white flex items-center justify-between text-left transition-all ${
              activeFilter === "liability" ? "ring-4 ring-pink-300 scale-[1.02]" : "hover:scale-[1.01]"
            }`}
          >
            <div>
              <p className="text-sm opacity-90">Total Liability</p>
              <p className="text-3xl font-bold">₹{totalLiability.toLocaleString()}</p>
            </div>
            <Calendar className="w-12 h-12 opacity-80" />
          </button>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, contact, or address..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            {activeFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Filter: {activeFilter === "liability" ? "With Pending" : activeFilter}
                <button onClick={() => setActiveFilter("all")} className="ml-1 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Labour
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white hover:bg-white">
                  <TableHead className="text-blue-600 font-semibold">Name</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Age</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Contact</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Address</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Type</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Hours</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Permanent Salary</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Hourly Salary</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Total</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Pending</TableHead>
                  <TableHead className="text-blue-600 font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((labour) => (
                  <TableRow key={labour.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{labour.name}</TableCell>
                    <TableCell>{labour.age}</TableCell>
                    <TableCell>{labour.contact}</TableCell>
                    <TableCell>{labour.address}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          labour.type === "Permanent"
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-orange-50 text-orange-500 border-orange-200"
                        }
                      >
                        {labour.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{labour.hours}</TableCell>
                    <TableCell>₹{labour.permanentSalary.toLocaleString()}</TableCell>
                    <TableCell>₹{labour.hourlySalary.toLocaleString()}</TableCell>
                    <TableCell>₹{labour.total.toLocaleString()}</TableCell>
                    <TableCell className="text-red-500 font-medium">₹{labour.pending.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                      No labours found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-blue-600">Add New Labour</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newLabour.name}
                  onChange={(e) => setNewLabour({ ...newLabour, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={newLabour.age}
                  onChange={(e) => setNewLabour({ ...newLabour, age: e.target.value })}
                  placeholder="Enter age"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={newLabour.contact}
                onChange={(e) => setNewLabour({ ...newLabour, contact: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newLabour.address}
                onChange={(e) => setNewLabour({ ...newLabour, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newLabour.type}
                  onValueChange={(value: "Permanent" | "Hourly") => setNewLabour({ ...newLabour, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  value={newLabour.hours}
                  onChange={(e) => setNewLabour({ ...newLabour, hours: e.target.value })}
                  placeholder="Enter hours"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {newLabour.type === "Permanent" ? (
                <div className="space-y-2">
                  <Label htmlFor="permanentSalary">Permanent Salary</Label>
                  <Input
                    id="permanentSalary"
                    type="number"
                    value={newLabour.permanentSalary}
                    onChange={(e) => setNewLabour({ ...newLabour, permanentSalary: e.target.value })}
                    placeholder="₹0"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="hourlySalary">Hourly Salary</Label>
                  <Input
                    id="hourlySalary"
                    type="number"
                    value={newLabour.hourlySalary}
                    onChange={(e) => setNewLabour({ ...newLabour, hourlySalary: e.target.value })}
                    placeholder="₹0"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="pending">Pending Amount</Label>
                <Input
                  id="pending"
                  type="number"
                  value={newLabour.pending}
                  onChange={(e) => setNewLabour({ ...newLabour, pending: e.target.value })}
                  placeholder="₹0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleAddLabour}
              disabled={!newLabour.name || !newLabour.contact}
            >
              Add Labour
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
