import {  Column, Entity, PrimaryColumn } from "typeorm";
//import { BaseEntity} from './base-entity';



@Entity('users_details')
export class users  {
    @Column ({type:'varchar',length: 255,nullable:true})
    company_id: string ;
    @Column ({type:'varchar',length: 255,nullable:true})
    firstname: string ;
    @Column ({type:'varchar',length: 255,nullable:true})
    lastname : string ;
    @Column ({type:'varchar',length: 255,nullable:true})
    sex : string;
   @Column ({type:'date',nullable:true})
    date_of_birth: Date;
    @Column ({type:'bigint',nullable:true})
    mobile_number: BigInt;
    @Column ({type:'varchar',length: 255,nullable:true})
    designation  : String;
    @Column ({type:'varchar',length: 255,nullable:true})
    job_description  : String;
    @Column ({type:'varchar',length: 255,nullable:true})
    portfolio  : String;
    @Column ({type:'varchar',length: 255,nullable:true})
    city  : String;
    @Column ({type:'varchar',length: 255,nullable:true})
    country  : String;
    @Column ({type:'bigint',nullable:true})
    official_number  : BigInt;
    @Column ({type:'varchar',length: 255,nullable:true})
    primary_email: string;
    @Column ({type:'varchar',length: 255,nullable:true})
    password  : string;
    @Column ({type:'varchar',length: 255,nullable:true})
    secondary_email  : String;
    @Column ({type:'bigint',nullable:true})
    current_comapnay_experience  : BigInt;
    @Column ({type:'varchar',length: 255,nullable:true})
    previous_company   : string;
    @Column ({type:'varchar',length: 255,nullable:true})
    company  : String;
    @Column ({type:'varchar',length: 255,nullable:true})
    linkdin  : String;
    @Column ({type:'varchar',length: 255,nullable:true})
    twitter  : String;
    @Column ({type:'varchar',length: 255,nullable:true})
    instagram  : String;
    @Column ({type:'varchar',length: 255,nullable:true})
    role  : string;
    @Column ({type:'varchar',length: 255,nullable:true})
     action : String;
     @PrimaryColumn ({type:'varchar',length: 255,nullable:false})
     user_id : string;
   

}
