'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { KanbanProduct, useKanbanStore } from '../utils/store';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CATEGORY_OPTIONS } from '@/features/products/components/product-tables/options';
import { IconPlus } from '@tabler/icons-react';

export default function NewProductDialog() {
  const addProduct = useKanbanStore((state) => state.addProduct);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [image, setImage] = useState('https://api.slingacademy.com/public/sample-products/1.png');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);

    const product = {
      name,
      description,
      price,
      formattedPrice,
      image,
      columnId: category,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addProduct(product);

    // Reset form
    setName('');
    setDescription('');
    setPrice(0);
    setCategory(CATEGORY_OPTIONS[0].value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default' size='sm' className="flex items-center gap-1 shadow-sm">
          <IconPlus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product to add to your kanban board
          </DialogDescription>
        </DialogHeader>
        <form
          id='product-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Product name...'
              className='col-span-4'
              autoFocus
              required
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Description...'
              className='col-span-4 resize-none'
              rows={3}
              required
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <div className='col-span-2'>
              <Input
                id='price'
                type='number'
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                placeholder='Price...'
                required
              />
            </div>
            <div className='col-span-2'>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='image'
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder='Image URL (will appear in details view)...'
              className='col-span-4'
              required
            />
          </div>
        </form>
        <DialogFooter>
          <Button type='submit' form='product-form'>
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 