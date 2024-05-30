import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ContactRepository } from './entity/contact.entity';
import { Op } from 'sequelize';
import { ContactResponse, RequestBody } from './dto/contact.dto';

@Injectable()
export class AppService {

  constructor(@InjectModel(ContactRepository) private contactModel: typeof ContactRepository) { }

  async identifyCustomer(identifyCustomer: RequestBody) {
    const accountLimit = await this.findPrimaryAccountCompleted(identifyCustomer.email, identifyCustomer.phoneNumber)
    const isDuplicateAccount = await this.findDuplicateAccount(identifyCustomer.email, identifyCustomer.phoneNumber)
    if (isDuplicateAccount) console.log("isDuplicateAccount" + isDuplicateAccount);
    if (isDuplicateAccount) {
      // throw new ConflictException('Credentials are already associated with another contact.');
    } else {
      await this.contactModel.create({
        linkedId: accountLimit?.id,
        email: identifyCustomer.email,
        phoneNumber: identifyCustomer.phoneNumber,
        linkPrecedence: accountLimit ? 'secondary' : 'primary'
      })
    }
    const findContact = await this.contactModel.findAll({
      where: {
        [Op.or]: [
          { email: identifyCustomer.email },
          { phoneNumber: identifyCustomer.phoneNumber }
        ]
      }
    })
    let contactResponse = findContact.reduce((acc, ele) => {
      if (ele.linkPrecedence === 'primary' && !acc.primaryContactId) {
        acc.primaryContactId = ele.id;
      }
      if (ele?.email && !acc.emailSet.has(ele.email)) {
        acc.emails.push(ele.email);
        acc.emailSet.add(ele.email);
      }
      if (ele?.phoneNumber && !acc.phoneSet.has(ele.phoneNumber)) {
        acc.phoneNumbers.push(ele.phoneNumber);
        acc.phoneSet.add(ele.phoneNumber);
      }
      if (ele.linkPrecedence === 'secondary' && !acc.secondaryIdSet.has(ele.id)) {
        acc.secondaryContactIds.push(ele.id);
        acc.secondaryIdSet.add(ele.id);
      }
      return acc;
    }, {
      primaryContactId: null,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
      emailSet: new Set(),
      phoneSet: new Set(),
      secondaryIdSet: new Set()
    });

    delete contactResponse.emailSet;
    delete contactResponse.phoneSet;
    delete contactResponse.secondaryIdSet;
    return { contact: contactResponse }
  }

  private async findPrimaryAccountCompleted(identifyEmail: string, identifyMobile: string): Promise<ContactRepository> {
    try {
      const orCondition = [
        identifyEmail && {
          email: identifyEmail, linkPrecedence: 'primary'
        },
        identifyMobile && { phoneNumber: identifyMobile, linkPrecedence: 'primary' },
      ]
      const findAccountLimit = await this.contactModel.findOne({
        where: {
          [Op.or]: orCondition
        }
      })
      return findAccountLimit
    } catch (error) {
      console.log(error);
    }
  }

  private async findDuplicateAccount(identifyEmail: string, identifyMobile: string): Promise<boolean> {
    try {
      const whereCondition: any = {};
      identifyEmail && (whereCondition['email'] = identifyEmail)
      identifyMobile && (whereCondition['phoneNumber'] = identifyMobile)

      const isDuplicateAccount = await this.contactModel.findOne({
        where: whereCondition
      })
      return isDuplicateAccount?.phoneNumber == identifyMobile || isDuplicateAccount?.email == identifyEmail ? true : isDuplicateAccount?.phoneNumber != null && isDuplicateAccount?.email != null ? true : false
    } catch (error) {
      console.log(error);
    }
  }


  getHello(): string {
    return 'Hello World!';
  }

}

