import { TypeOrmModuleOptions } from "@nestjs/typeorm"
export const config: TypeOrmModuleOptions ={
    type :'postgres',
    username : 'vkeonldoimljev',
    password :'527ca61420721afe51c4397c42fcb249628d8fcb692d6b82bfb7e18f9f344dfd',
    port : 5432,
    host :'ec2-44-199-26-122.compute-1.amazonaws.com',
    database : 'daqom94cuir0e9',
    synchronize : true,
    entities: ['dist/**/*.entity{.ts,.js}'],
     ssl: {      /* <----- Add SSL option */
        require: true,
        rejectUnauthorized: false 
      }

};

