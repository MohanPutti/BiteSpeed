import Contact from "../../models/contact.js";
import mysql from '../../models/mysql.js';
import Op from 'sequelize';


const contactIdentityService = async({email,mobile}) =>{

    //check contact with email
    // check contact with mobile
    //if both doesn't exist create new
    //if email exists and mobile exists combine all of them and gove output
    //if email doesn't exists and mobile exists create new secondary
    //if mobile doesn't exists and email exists create new secondary
    //if email exists and mobile exists and its one id then make it primary and all others secondary 
    let primaryContactId="";
    let emails=[];
    let phoneNumbers=[];
    let secondaryContactIds=[];

    /**
     * if both email and mobile are passed check if any contact is available with both of them then check if its primary or secondary and get all contacts
     */
    if(email!=null && mobile!=null){
        let emailMobileContact = await mysql.getContacts({email,mobile});
        if(emailMobileContact.length>0){
            if(emailMobileContact[0].linkPrecedence=="primary"){
                primaryContactId=emailMobileContact[0].id;
                let linkedContacts = await mysql.getLinkedContacts({id:emailMobileContact[0].id});
                for(let contact of linkedContacts){
                    emails.push(contact.email);
                    phoneNumbers.push(contact.phoneNumber);
                    secondaryContactIds.push(contact.id);
                }
                emails.unshift(emailMobileContact[0].email);
                phoneNumbers.unshift(emailMobileContact[0].phoneNumber);
            }else{
                primaryContactId=emailMobileContact[0].linkedId;
                let primaryContact = await mysql.getPrimaryContact({id:emailMobileContact[0].linkedId});
                let linkedContacts = await mysql.getLinkedContacts({id:primaryContact[0].id});
                for(let contact of linkedContacts){
                    emails.push(contact.email);
                    phoneNumbers.push(contact.phoneNumber);
                    secondaryContactIds.push(contact.id);
                }
                emails.unshift(primaryContact[0].email);
                phoneNumbers.unshift(primaryContact[0].phoneNumber);
            }
            return {
                "contact":{
                    "primaryContactId":primaryContactId,
                    "emails":[...new Set(emails)],
                    "phoneNumbers":[...new Set(phoneNumbers)],
                    "secondaryContactIds":[...new Set(secondaryContactIds.filter(item=> item!=primaryContactId))]
                }
            }
        }
    }

    let emailContacts=[];
    let mobileContacts=[];
    if(email!=null){
        emailContacts = await mysql.getContactsWithEmail({email});
    }
    if(mobile!=null){
        mobileContacts = await mysql.getContactsWithMobile({mobile});
    }
    
    /**
     * get all email contacts and mobile contacts if both are there then
     * update all pf them to secondary and make new request as primary contact
     * get all contacts
     */
    if(emailContacts.length>0 && mobileContacts.length>0){
        let newContact = await mysql.createContact({email:email,mobile:mobile});
        for(let eContact of emailContacts){
            let updateContact = await mysql.updateContact({id:eContact.id,linkPrecedence:'secondary',linkedId:newContact.id})
            emails.push(eContact.email);
            phoneNumbers.push(eContact.phoneNumber);
            secondaryContactIds.push(eContact.id);   
        }
        for(let mContact of mobileContacts){
            let updateContact = await mysql.updateContact({id:mContact.id,linkPrecedence:'secondary',linkedId:newContact.id})
            emails.push(mContact.email);
            phoneNumbers.push(mContact.phoneNumber);
            secondaryContactIds.push(mContact.id);   
        }
        emails.unshift(newContact.email);
        phoneNumbers.unshift(newContact.phoneNumber);
        primaryContactId=newContact.id;
        return {
            "contact":{
                "primaryContactId":newContact.id,
                "emails":[...new Set(emails)],
                "phoneNumbers":[...new Set(phoneNumbers)],
                "secondaryContactIds":[...new Set(secondaryContactIds.filter(item=> item!=primaryContactId))]
            }
        }
    }

    /**
     * create secondary conact if new data found with old email
     */
    if(emailContacts.length>0 && mobile!=null && email!=null ){
        let newContact;
        let linkedContacts;
        let primaryContactId;
        if(emailContacts[0].linkPrecedence=='primary'){
            newContact = await mysql.createSecondaryContact({email,mobile,linkedId:emailContacts[0].id});
            linkedContacts = await mysql.getLinkedContacts({id:emailContacts[0].id});
            primaryContactId=emailContacts[0].id;
            emails.unshift(emailContacts[0].email);
            phoneNumbers.unshift(emailContacts[0].phoneNumber);
        }else{
            newContact = await mysql.createSecondaryContact({email,mobile,linkedId:emailContacts[0].linkedId});
            let primaryContact = await mysql.getPrimaryContact({id:emailContacts[0].linkedId});
            linkedContacts = await mysql.getLinkedContacts({id:emailContacts[0].linkedId});
            primaryContactId=primaryContact[0].id;
            emails.unshift(primaryContact[0].email);
            phoneNumbers.unshift(primaryContact[0].phoneNumber);
        }
        for(let contact of linkedContacts){
            emails.push(contact.email);
            phoneNumbers.push(contact.phoneNumber);
            secondaryContactIds.push(contact.id);
        }
        return {
            "contact":{
                "primaryContactId":primaryContactId,
                "emails":[...new Set(emails)],
                "phoneNumbers":[...new Set(phoneNumbers)],
                "secondaryContactIds":[...new Set(secondaryContactIds.filter(item=> item!=primaryContactId))]
            }
        }

    }

    /**
     * create secondary conact if new data found with old phonenumber
     */
    if(mobileContacts.length>0 && mobile!=null && email!=null ){
        console.log("heheheh");
        let newContact;
        let linkedContacts;
        let primaryContactId;
        if(mobileContacts[0].linkPrecedence=='primary'){
            newContact = await mysql.createSecondaryContact({email,mobile,linkedId:mobileContacts[0].id});
            linkedContacts = await mysql.getLinkedContacts({id:mobileContacts[0].id});
            primaryContactId=mobileContacts[0].id;
            emails.unshift(mobileContacts[0].email);
            phoneNumbers.unshift(mobileContacts[0].phoneNumber);
        }else{
            newContact = await mysql.createSecondaryContact({email,mobile,linkedId:mobileContacts[0].linkedId});
            let primaryContact = await mysql.getPrimaryContact({id:mobileContacts[0].linkedId});
            linkedContacts = await mysql.getLinkedContacts({id:mobileContacts[0].linkedId});
            primaryContactId=primaryContact[0].id;
            emails.unshift(primaryContact[0].email);
            phoneNumbers.unshift(primaryContact[0].phoneNumber);
        }
        for(let contact of linkedContacts){
            emails.push(contact.email);
            phoneNumbers.push(contact.phoneNumber);
            secondaryContactIds.push(contact.id);
        }
        return {
            "contact":{
                "primaryContactId":primaryContactId,
                "emails":[...new Set(emails)],
                "phoneNumbers":[...new Set(phoneNumbers)],
                "secondaryContactIds":[...new Set(secondaryContactIds.filter(item=> item!=primaryContactId))]
            }
        }

    }
    /**
     * get contacts with matching of any email or mobile
     * if not available create new contact with primary
     * if available check if it's primary pr secondary and get all linked contacts
     */
    let contactsAvailable = await checkIfContactAvailable({email,mobile});
    if(contactsAvailable.length==0){
        let newContact = await mysql.createContact({email:email,mobile:mobile});
        console.log(newContact.id);
        return {
            "contact":{
                "primaryContactId":newContact.id,
                "emails":[newContact.email],
                "phoneNumbers":[newContact.phoneNumber],
                "secondaryContactIds":[]
            }
        }
    }


    for(let contact of contactsAvailable) {
        if(contact.linkPrecedence=="primary"){
            let linkedContacts = await mysql.getLinkedContacts({id:contact.id});
            linkedContacts.forEach(lContact=>{
                emails.push(lContact.email);
                phoneNumbers.push(lContact.phoneNumber);
                secondaryContactIds.push(lContact.id);
            })
            primaryContactId=contact.id;
            emails.unshift(contact.email);
            phoneNumbers.unshift(contact.phoneNumber);
        }else{
            let primaryContact = await mysql.getPrimaryContact({id:contact.linkedId});
            let linkedContacts = await mysql.getLinkedContacts({id:primaryContact[0].id});
            linkedContacts.forEach(lContact=>{
                emails.push(lContact.email);
                phoneNumbers.push(lContact.phoneNumber);
                secondaryContactIds.push(lContact.id);
            })
            emails.unshift(primaryContact[0].email);
            phoneNumbers.push(primaryContact[0].phoneNumber);
        }
        
    };

    let res={
        "contact":{
            "primaryContactId":primaryContactId,
            "emails":[...new Set(emails)],
            "phoneNumbers":[...new Set(phoneNumbers)],
            "secondaryContactIds":[...new Set(secondaryContactIds.filter(item=> item!=primaryContactId))]
        }
    }

    return res;
}

const checkIfContactAvailable = async ({email,mobile}) => {
    let res= await mysql.getAllContacts({email:email,mobile:mobile});
    return res;
}

export {contactIdentityService}