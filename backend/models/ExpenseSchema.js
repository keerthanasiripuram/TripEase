const mongoose=require('mongoose')
const {Schema,Types}=mongoose;

const ExpenseSchema=new Schema({

    
    user:{
        type:Types.ObjectId,
        ref:'user',
    },
    budgetName:{
        type:String,
        required:true,
    },
    totalAmount:
    {
        type:Number,
        default:0
    },
    expenseList: [{
        expenseName: {
            type: String,
            
        },
        expenseAmount: {
            type: String,          
        }
    }]
    
},
{
    timestamps: true,
    versionKey: false
}
)
module.exports = mongoose.model('Expense', ExpenseSchema)