import bcrypt from "bcryptjs";
import UserSchema from "@/models/schemas/UserSchema";

interface RegisterProps {
  email: string,
  password: string,
  name: string
}

interface QueryParams {
  company_id?: Object
}

const register = async function(props: RegisterProps) {
  const { email, password, name } = props;
    try {
        const userFound = await UserSchema.findOne({ email: email });
        if(userFound){
            return {
                error: 'already_registered'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = UserSchema.create({
          name: name,
          email: email,
          password: hashedPassword,
        });
        return user;
    } catch(e){
        console.log(e);
    }
}

const getList = async function (user_id: string | null) {
  
}

const get = async function (id: string) {
  return UserSchema.findById(id);
}

const update = async function(id: string, data: any) {
  const user = await get(id);

  
}

const create = async function (data: any) {
  const userFound = await UserSchema.findOne({ $or: [ {email: data.email}, {phone: data.phone} ] });
  if (userFound) {
    return {
      error: 'already_registered'
    };
  }
  if (!data.password) {
    data.password = await bcrypt.hash(data.email, 10);
  }
  return await UserSchema.create(data);
}

export default {
  register,
  getList,
  get,
  update,
  create
}