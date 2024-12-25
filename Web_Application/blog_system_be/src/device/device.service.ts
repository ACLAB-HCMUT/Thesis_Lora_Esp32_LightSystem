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

  async getErrorDevice(db_arr: string[], new_arr: string[]): Promise<string[]> {
    const result = db_arr.filter((str) => !new_arr.includes(str));
    return result;
  }

  // Handle check db vs mqtt topic
  async checkAndInsert(devices: any): Promise<any> {
    try {
      const missingDevices = [];
      const updatedDevices = [];

      // Log the type of devices to validate input
      console.log('check type', typeof devices);

      // Validate if devices is an array
      if (!Array.isArray(devices)) {
        throw new Error('Invalid input: devices must be an array');
      }

      // Extract all device_ids from the incoming data
      const incomingDeviceIds = devices.map((device) => device.device_id);
      console.log('check incoming', incomingDeviceIds);

      // Fetch all devices from the database
      const allDevicesInDb = await this.getAllDeviceIdsAsNumbers();
      const formattedAllDevicesInDb = allDevicesInDb.map((device_id: number) =>
        this.formatDeviceID(device_id),
      );

      console.log('check in database', formattedAllDevicesInDb);

      // Track devices in the database but not in the incoming data
      const untrackedDevices = await this.getErrorDevice(
        formattedAllDevicesInDb,
        incomingDeviceIds,
      );
      console.log('check in database but not in incoming', untrackedDevices);
      if (untrackedDevices.length > 0) {
        try {
          for (const device of untrackedDevices) {
            const deviceNeedUncheck = await this.DeviceReposity.findOne({
              where: { device_id: device },
            });
            if (deviceNeedUncheck) {
              deviceNeedUncheck.check = false;
              await this.DeviceReposity.save(deviceNeedUncheck);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      // Process devices
      for (const device of devices) {
        try {
          const existingDevice = await this.DeviceReposity.findOne({
            where: { device_id: device.device_id },
          });

          if (!existingDevice) {
            // Track devices in the data but not in the database
            missingDevices.push(device.device_id);
          } else {
            // Prepare device for update
            existingDevice.status = device.status === '01' ? true : false;
            existingDevice.sensor = device.sensor;
            existingDevice.timestamp = currentTime();
            existingDevice.check = true;
            // Push the updated device for later processing
            updatedDevices.push(existingDevice);
          }
        } catch (error) {
          console.error(
            `Error processing device with ID ${device.device_id}:`,
            error,
          );
          // Optionally, continue to process other devices
        }
      }

      // Update devices in the database (bulk update)
      if (updatedDevices.length > 0) {
        try {
          await this.DeviceReposity.save(updatedDevices);
          console.log('Updated devices saved successfully.');
        } catch (error) {
          console.error('Error saving updated devices:', error);
        }
      }

      return {
        message: 'Process completed',
        missingDevices,
        updatedCount: updatedDevices.length,
        untrackedDevices,
      };
    } catch (error) {
      console.error('Error in checkAndInsert:', error);
      // Return an error response but prevent the program from crashing
      return {
        message: 'Error occurred during processing',
        error: error.message,
      };
    }
  }

  async getAllDatabase() {
    return await this.DeviceReposity.find();
  }
}
