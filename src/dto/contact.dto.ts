export class RequestBody {
  email?: string;
  phoneNumber?: string;
}



export class ContactResponse {
  primaryContactId?: number;
  emails?: string[]; // first element being email of primary contact
  phoneNumbers?: string[]; // first element being phoneNumber of primary contact
  secondaryContactIds?: number[]; // Array of all Contact IDs that are "secondary"
}