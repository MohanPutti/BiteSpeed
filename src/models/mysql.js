
import Contact from "./contact.js";
import { Op } from "sequelize";

const getAllContacts = async ({email,mobile}) => {
    try{
    let res= await Contact.findAll({
    where:{
        [Op.or]:[
            {email:email},
            {phoneNumber:mobile}
        ]
        }
    });
    return res;
    }
    catch(err){
        console.log(err)
    }
}

const getContacts = async ({email,mobile}) => {
    try{
    let res= await Contact.findAll({
    where:{email:email,
            phoneNumber:mobile
        }
    });
    return res;
    }
    catch(err){
        console.log(err)
    }
}
const createContact = async({email,mobile}) => {
    try{
    let res = await Contact.create({
        email:email,
        phoneNumber:mobile,
        linkPrecedence:'primary',
        createdAt: Date.now(),
        updatedAt:Date.now()
    })
    return res;}
    catch(err){
        console.log(err);
    }
}
const createSecondaryContact = async({email,mobile,linkedId}) => {
    try{
    let res = await Contact.create({
        email:email,
        phoneNumber:mobile,
        linkPrecedence:'secondary',
        linkedId:linkedId,
        createdAt: Date.now(),
        updatedAt:Date.now()
    })
    return res;}
    catch(err){
        console.log(err);
    }
}

const getLinkedContacts = async ({id}) =>{

    try{
        console.log("id",id);
        let res= await Contact.findAll({
        where:{
            linkedId:id
        }});
        return res;
        }
        catch(err){
            console.log(err)
        }
}

const getPrimaryContact = async ({id}) =>{

    try{
        let res= await Contact.findAll({
        where:{
            id:id
        }});
        return res;
        }
        catch(err){
            console.log(err)
        }
}

const getContactsWithEmail = async ({email}) =>{

    try{
        let res= await Contact.findAll({
        where:{
            email:email
        }});
        return res;
        }
        catch(err){
            console.log(err)
        }
}

const getContactsWithMobile = async ({mobile}) =>{

    try{
        let res= await Contact.findAll({
        where:{
            phoneNumber:mobile
        }});
        return res;
        }
        catch(err){
            console.log(err)
        }
}

const updateContact = async ({linkPrecedence,linkedId,id}) => {
    try{
        let updateValues ={
            linkPrecedence:linkPrecedence,
            linkedId:linkedId
        }
        console.log(id,linkedId);
        let res= await Contact.update(
            updateValues,{
        where:{
            id:id
        }});
        return res;
        }
        catch(err){
            console.log(err)
        }
}
export default {getContacts,getAllContacts,createContact,getLinkedContacts,getPrimaryContact,getContactsWithEmail,getContactsWithMobile,updateContact,createSecondaryContact}