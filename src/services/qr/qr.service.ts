import { Injectable } from '@nestjs/common';
import * as QrCode from 'qrcode';

Injectable();
export class QrService {
  async generateQrCode(url: string): Promise<string> {
    try {
      return await QrCode.toDataURL(url);
    } catch (error) {
      throw new Error('Error creating QR Code!');
    }
  }
}
