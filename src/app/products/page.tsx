'use client'

import type React from "react"
import { ProtectedLayout } from "@/components/ProtectedLayout"
import { Badge } from "@/components/ui/Badge"
import { useEffect, useState, useCallback, useRef } from "react"
import { api } from "@/lib/api-client"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  BoxIcon,
  IndianRupee,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"


interface Batch {
  batchNumber: string
  quantity: number
  expiryDate?: string // normalize to ISO string
  costPrice: number
  createdAt?: string
}

interface Product {
  _id: string
  name: string
  sku: string
  category: string
  costPrice: number
  salePrice: number
  unit: string
  minStock: number
  batches?: Batch[]
}

interface Category {
  _id: string
  name: string
}

// form template
const emptyForm = {
  name: "",
  sku: "",
  category: "",
  costPrice: "",
  salePrice: "",
  unit: "pcs",
  minStock: "5",
  quantity: "", // renamed from initialStock -> quantity
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div
        className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
          type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  // data
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ui / filters
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // product modal
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(() => ({ ...emptyForm }))
  const [formLoading, setFormLoading] = useState(false)

  // stock modal
  const [stockModal, setStockModal] = useState<{ type: "in" | "out"; product: Product } | null>(null)
  const [stockQty, setStockQty] = useState("")
  const [stockLoading, setStockLoading] = useState(false)

  // toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const toastRef = useRef<number | null>(null)

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    if (toastRef.current) window.clearTimeout(toastRef.current)
    toastRef.current = window.setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    fetchData()
    return () => {
      if (toastRef.current) window.clearTimeout(toastRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("search-input")?.focus()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "n" && !showProductModal && !stockModal) {
        e.preventDefault()
        openProductModal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showProductModal, stockModal])

  async function fetchData() {
    setIsLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([api.getProducts(), api.getCategories()])
      setProducts(productsRes.data.data || [])
      setCategories(categoriesRes.data.data || [])
    } catch (err) {
      showToast("Failed to load products", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // helpers
  const getStock = (product: Product) => product.batches?.reduce((sum, b) => sum + (b.quantity || 0), 0) || 0

  const normalizeNumber = (v: string) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  const normalizeStockPayload = (productId: string, qty: number, costPrice: number) => ({
    productId,
    quantity: qty,
    costPrice,
    batchNumber: `BATCH-${Date.now()}`,
  })

  const consistentMargin = (prod: Product) => {
    // margin on cost: (sale - cost) / cost * 100
    if (!prod.costPrice || prod.costPrice <= 0) return "0"
    return (((prod.salePrice - prod.costPrice) / prod.costPrice) * 100).toFixed(0)
  }

  // open/close product modal
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        costPrice: product.costPrice.toString(),
        salePrice: product.salePrice.toString(),
        unit: product.unit || "pcs",
        minStock: product.minStock?.toString() || "5",
        quantity: "", // do not show existing qty here; quantity is for initial add
      })
    } else {
      setEditingProduct(null)
      setFormData({ ...emptyForm })
    }
    setShowProductModal(true)
  }

  const closeProductModal = () => {
    setShowProductModal(false)
    setEditingProduct(null)
    setFormData({ ...emptyForm })
  }

  // create / update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      // basic validation
      if (!formData.name.trim() || !formData.sku.trim() || !formData.category) {
        showToast("Please fill required fields", "error")
        setFormLoading(false)
        return
      }
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        costPrice: normalizeNumber(formData.costPrice),
        salePrice: normalizeNumber(formData.salePrice),
        unit: formData.unit || "pcs",
        minStock: Math.max(0, Math.floor(normalizeNumber(formData.minStock))),
      }

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload)
        showToast("Product updated", "success")
      } else {
        const res = await api.createProduct(payload)
        const newId = res?.data?.data?._id
        if (formData.quantity && Number.parseInt(formData.quantity) > 0 && newId) {
          const qty = Number.parseInt(formData.quantity)
          // attempt bulk endpoint if available
          if ((api as any).bulkStockIn) {
            await (api as any).bulkStockIn(newId, [{ quantity: qty, costPrice: payload.costPrice, batchNumber: `BATCH-${Date.now()}` }])
          } else {
            await api.stockIn(normalizeStockPayload(newId, qty, payload.costPrice))
          }
        }
        showToast("Product created", "success")
      }

      closeProductModal()
      fetchData()
    } catch (err: any) {
      showToast(err?.response?.data?.error || "Failed to save", "error")
    } finally {
      setFormLoading(false)
    }
  }

  // delete
  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return
    try {
      await api.deleteProduct(product._id)
      showToast("Product deleted", "success")
      fetchData()
    } catch (err) {
      showToast("Failed to delete", "error")
    }
  }

  // stock in/out
  const handleStock = async () => {
    if (!stockModal || !stockQty) return
    setStockLoading(true)
    const qty = Math.floor(normalizeNumber(stockQty))
    if (!qty || qty <= 0) {
      showToast("Enter valid quantity", "error")
      setStockLoading(false)
      return
    }

    try {
      if (stockModal.type === "in") {
        await api.stockIn({
          productId: stockModal.product._id,
          quantity: qty,
          costPrice: stockModal.product.costPrice,
          batchNumber: `BATCH-${Date.now()}`,
          expiryDate: undefined,
        })
        showToast(`Added ${qty} ${stockModal.product.unit}`, "success")
      } else {
        await api.stockOut({
          productId: stockModal.product._id,
          quantity: qty,
        })
        showToast(`Removed ${qty} ${stockModal.product.unit}`, "success")
      }
      setStockModal(null)
      setStockQty("")
      fetchData()
    } catch (err: any) {
      showToast(err?.response?.data?.error || "Stock update failed", "error")
    } finally {
      setStockLoading(false)
    }
  }

  // filtered products
  const filtered = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    const stock = getStock(p)
    const matchTab =
      activeTab === "all" || (activeTab === "low" && stock <= p.minStock) || (activeTab === "ok" && stock > p.minStock)
    return matchSearch && matchTab
  })

  // stats
  const lowStockCount = products.filter((p) => getStock(p) <= p.minStock).length
  const totalValue = products.reduce((sum, p) => sum + getStock(p) * p.costPrice, 0)

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Products</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{products.length} products in inventory</p>
            </div>
            <Button onClick={() => openProductModal()} size="lg" className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
              <BoxIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{products.length} Products</span>
            </div>
            {lowStockCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  {lowStockCount} Low Stock
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {totalValue.toLocaleString()} Value
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search-input"
                placeholder="Search products... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-10">
                <TabsTrigger value="all" className="px-4">
                  All
                </TabsTrigger>
                <TabsTrigger value="low" className="px-4">
                  Low Stock
                </TabsTrigger>
                <TabsTrigger value="ok" className="px-4">
                  In Stock
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Products List */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="h-14 animate-pulse bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  {searchQuery || activeTab !== "all" ? (
                    <Search className="w-7 h-7 text-muted-foreground" />
                  ) : (
                    <Sparkles className="w-7 h-7 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {searchQuery ? "No results found" : activeTab !== "all" ? "No products here" : "Start adding products"}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  {searchQuery
                    ? `No products match "${searchQuery}"`
                    : activeTab !== "all"
                    ? "Try changing your filter"
                    : "Add your first product to start managing inventory"}
                </p>
                {!searchQuery && activeTab === "all" && (
                  <Button onClick={() => openProductModal()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Your First Product
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map((product) => {
                const stock = getStock(product)
                const isLow = stock <= product.minStock
                const margin = consistentMargin(product)

                return (
                  <Card
                    key={product._id}
                    className={`group transition-all hover:shadow-md ${isLow ? "border-orange-200 dark:border-orange-800" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                            <Badge variant="outline" className="text-xs font-mono shrink-0">
                              {product.sku}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>₹{product.costPrice.toFixed(2)} cost</span>
                            <span className="text-foreground font-medium">₹{product.salePrice.toFixed(2)} sale</span>
                            <span className="text-green-600 dark:text-green-400">+{margin}%</span>
                          </div>
                        </div>

                        {/* Stock Display with Quick Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setStockModal({ type: "out", product })}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-orange-600 transition-colors"
                            title="Remove stock"
                            aria-label={`Remove stock for ${product.name}`}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          <div
                            className={`min-w-[80px] text-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                              isLow
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            }`}
                            aria-live="polite"
                          >
                            {stock} {product.unit}
                          </div>

                          <button
                            onClick={() => setStockModal({ type: "in", product })}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-green-600 transition-colors"
                            title="Add stock"
                            aria-label={`Add stock for ${product.name}`}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Edit/Delete */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openProductModal(product)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(product)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Product Dialog */}
        <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
              <DialogDescription>{editingProduct ? "Update the product details below" : "Fill in the details to add a new product"}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product name" required autoFocus />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="SKU-001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price (₹)</Label>
                  <Input id="costPrice" type="number" step="0.01" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (₹)</Label>
                  <Input id="salePrice" type="number" step="0.01" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} placeholder="0.00" required />
                </div>
              </div>

              {formData.costPrice && formData.salePrice && Number.parseFloat(formData.costPrice) > 0 && (
                <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                  Profit: ₹{(Number.parseFloat(formData.salePrice) - Number.parseFloat(formData.costPrice)).toFixed(2)} (
                  {(
                    ((Number.parseFloat(formData.salePrice) - Number.parseFloat(formData.costPrice)) / Number.parseFloat(formData.costPrice)) *
                    100
                  ).toFixed(0)}
                  % margin)
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="pcs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Low Stock Alert</Label>
                  <Input id="minStock" type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} placeholder="5" />
                </div>
              </div>

              {!editingProduct && (
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="quantity">Quantity (optional)</Label>
                  <Input id="quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="Enter opening quantity (leave empty to add later)" />
                  <p className="text-xs text-muted-foreground">If you enter a quantity here, it will be added as the initial stock for the product after creation.</p>
                </div>
              )}

              <DialogFooter className="gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeProductModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingProduct ? "Save Changes" : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Stock Dialog */}
        <Dialog
          open={!!stockModal}
          onOpenChange={() => {
            setStockModal(null)
            setStockQty("")
          }}
        >
          <DialogContent className="sm:max-w-xs">
            <DialogHeader>
              <DialogTitle>{stockModal?.type === "in" ? "Add Stock" : "Remove Stock"}</DialogTitle>
              <DialogDescription>{stockModal?.product.name}</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Label htmlFor="stockQty" className="sr-only">
                Quantity
              </Label>
              <Input
                id="stockQty"
                type="number"
                min="1"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                placeholder={`Enter quantity (${stockModal?.product.unit || "pcs"})`}
                autoFocus
                className="text-center text-lg h-12"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStockModal(null)
                  setStockQty("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStock}
                disabled={stockLoading || !stockQty}
                className={stockModal?.type === "in" ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
              >
                {stockLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {stockModal?.type === "in" ? "Add" : "Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </ProtectedLayout>
  )
}
