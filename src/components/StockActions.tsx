import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Alert } from './ui/Alert';
import { api } from '@/lib/api-client';

interface StockActionProps {
  productId: string;
  productName: string;
  currentStock: number;
  onSuccess?: () => void;
}

export function StockInModal({ productId, productName, onSuccess }: StockActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.stockIn({
        productId,
        quantity: parseInt(quantity),
        costPrice: parseFloat(costPrice),
        batchNumber: batchNumber || undefined,
        expiryDate: expiryDate || undefined,
        reason: reason || undefined,
      });

      setMessage(`✓ Stock added successfully! New quantity: ${response.data.data.newQuantity}`);
      setQuantity('');
      setCostPrice('');
      setBatchNumber('');
      setExpiryDate('');
      setReason('');
      setTimeout(() => {
        setIsOpen(false);
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-green-600 hover:bg-green-700 text-white text-sm px-2">
        Stock In +
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Stock In - {productName}</h2>

          {error && <Alert className="mb-4 bg-red-50 border-red-200">{error}</Alert>}
          {message && <Alert className="mb-4 bg-green-50 border-green-200">{message}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity *</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cost Price *</label>
              <Input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="Enter cost price"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Batch Number</label>
              <Input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="Leave empty for auto-generated"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <Input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Purchase, Return, etc."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'Adding...' : 'Add Stock'}
              </Button>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export function StockOutModal({ productId, productName, currentStock, onSuccess }: StockActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.stockOut({
        productId,
        quantity: parseInt(quantity),
        reason: reason || undefined,
        reference: reference || undefined,
      });

      setMessage(`✓ Stock removed successfully! New quantity: ${response.data.data.newQuantity}`);
      setQuantity('');
      setReason('');
      setReference('');
      setTimeout(() => {
        setIsOpen(false);
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-red-600 hover:bg-red-700 text-white text-sm px-2">
        Stock Out -
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Stock Out - {productName}</h2>

          {error && <Alert className="mb-4 bg-red-50 border-red-200">{error}</Alert>}
          {message && <Alert className="mb-4 bg-green-50 border-green-200">{message}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Available Stock: <span className="font-bold text-blue-600">{currentStock}</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity to Remove *</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
                min="1"
                max={currentStock}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reason *</label>
              <Input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Sale, Damage, Expiry"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reference</label>
              <Input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., Order ID, Damage report"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? 'Removing...' : 'Remove Stock'}
              </Button>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
