
import Share from "../share/Share"
import Post from "../posts/Posts"
export default function Feed(props)
{
    console.log(props)
    return(
        <div className="feed">
            <div className="feedWrapper">
                <Share/>
                <Post name={props.name}/>{/*posts hss be rlde bcd on shre*/}
            </div>
        </div>
    )
}