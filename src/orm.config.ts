import { TypeOrmModuleOptions } from "@nestjs/typeorm"
export const config: TypeOrmModuleOptions ={
    type :'postgres',
    username : 'postgres',
    password :'fdpAdmin',
    port : 5432,
    host :'50.17.102.76',
    database : 'fdp_db',
    synchronize : true,
    entities: ['dist/**/*.entity{.ts,.js}'],
     ssl: {      /* <----- Add SSL option */
        require: true,
        rejectUnauthorized: false 
      }

};

