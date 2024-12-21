import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from './device.entity';
import { Repository } from 'typeorm';
import { currentTime } from 'src/ultils/helper';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly DeviceReposity: Repository<DeviceEntity>,
  ) {}

  // Return list of exist device_id
  async getAllDeviceIdsAsNumbers(): Promise<number[]> {
    try {
      const devices = await this.DeviceReposity.find({
        select: ['device_id'], // Select only the device_id column
      });

      const deviceIds = devices.map((device) => parseInt(device.device_id, 16));

      return deviceIds;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve device IDs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Generate random number in range min to max
  async getRandomInt(min: number, max: number): Promise<number> {
    if (min > max) {
      throw new Error("The 'min' value cannot be greater than 'max'.");
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Format deviceID
  formatDeviceID(device_id: number): string {
    const hexValue = device_id.toString(16);
    const paddedHex = hexValue.padStart(4, '0');
    return paddedHex;
  }

  // generate random number exclude exist device
  async getRandomIntExcludingExistingNumbers(
    min: number,
    max: number,
    excludeArrayNumbers?: number[],
  ): Promise<string> {
    if (min > max) {
      throw new Error("The 'min' value cannot be greater than 'max'.");
    }

    if (excludeArrayNumbers && excludeArrayNumbers.length >= max - min + 1) {
      throw new Error('All numbers in the range are excluded.');
    }

    let randomNumber: number;

    do {
      randomNumber = await this.getRandomInt(min, max);
    } while (excludeArrayNumbers?.includes(randomNumber));

    return this.formatDeviceID(randomNumber);
  }

  // register new device
  async insert_device() {
    try {
      const arrayExistDeviceID = await this.getAllDeviceIdsAsNumbers();
      const id = await this.getRandomIntExcludingExistingNumbers(
        2,
        65534,
        arrayExistDeviceID,
      );
      const new_device = {
        device_id: id,
        createAt: currentTime(),
      };
      console.log(new_device, 'checking');
      const saveDevice = await this.DeviceReposity.save(new_device);
      if (saveDevice) {
        console.log(saveDevice);
        return {
          id: saveDevice.device_id,
          statusCode: HttpStatus.OK,
          message: `Insert Device Successfully`,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async get_number_device() {
    const listDevice = await this.getAllDeviceIdsAsNumbers();
    return listDevice.length;
  }

  async getAddition(arr1: number[], arr2: number[]): Promise<number[]> {
    const result = arr1.filter((num) => !arr2.includes(num));

    return result;
  }
}
