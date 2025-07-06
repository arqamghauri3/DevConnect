import dbConnect from '@/lib/dbConnect';
import React from 'react'

export async function POST(request: Request) {
  await dbConnect();
}