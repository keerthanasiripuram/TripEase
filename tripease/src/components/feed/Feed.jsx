
import Share from "../share/Share"
import Post from "../posts/Posts"
export default function Feed(props)
{
    console.log(props)
    return(
        <div className="feed">
            <div className="feedWrapper">
                <Share/>
                <Post name={props.name}/>
            </div>
        </div>
    )
}