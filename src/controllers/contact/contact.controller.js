import { contactIdentityService } from "../../services/contact/contact.service.js";
const contactIdentity = async (req, res) => {
    
    let {email,mobile} = req.body;
    console.log(email,mobile);
    const result = await contactIdentityService({email,mobile});
    if(!result){
        return res.status(500).json({status:"false",error_description:result.data});
    }
    return res.status(200).json(result);
}
export {contactIdentity}