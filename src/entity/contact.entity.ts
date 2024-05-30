import { InferAttributes, InferCreationAttributes } from "sequelize";
import { BelongsTo, Column, DataType, Default, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";

@Table({ tableName: "contact", timestamps: true, paranoid: true })
export class ContactRepository extends Model<InferCreationAttributes<ContactRepository>, InferAttributes<ContactRepository>> {

    @Column({ autoIncrement: true, primaryKey: true })
    id: number;


    @Column(DataType.STRING(20))
    phoneNumber?: string;

    @Column(DataType.STRING(50))
    email?: string;

    @Column(DataType.INTEGER)
    linkedId?: number;

    @Default('primary')
    @Column(DataType.ENUM('primary', 'secondary'))
    linkPrecedence: 'primary' | 'secondary';

    @Column(DataType.DATE)
    deletedAt?: Date;

}