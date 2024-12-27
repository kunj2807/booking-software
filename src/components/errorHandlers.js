export const errorHandler=(error)=>{
    if(error?.response?.data?.message){
        return error?.response?.data?.message
    }else if(error?.response?.data?.error && Array.isArray(error?.response?.data?.error)){
        return error?.response?.data?.error.map(item=>item.msg).join(', ')
    }else{
        return error?.response?.data?.error
    }
}