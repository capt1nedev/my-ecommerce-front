import styled from "styled-components";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import StarsRating from "@/components/StarsRating";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";

const Title = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 5px;
`;
const Subtitle = styled.h3`
    font-size: 1rem;
    margin-top: 5px;
`;
const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    }
`;
const ReviewWrapper = styled.div`
    margin-bottom: 10px; 
    border-top: 1px solid #eee;
    padding: 10px 0;
    h3{
        margin: 3px 0;
        font-size: 1rem;
        color: #333;
        font-weight: normal;
    }
    p{
        margin: 0;
        font-size: .7rem;
        line-height: 1rem;
        color: #555;
    }
`;
const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    time{
        font-size: 12px;
        color: #aaa;
    }
`;
const StyledButton = styled(Button)`
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;
const ErrorMessage = styled.p`
    color: red;
    margin-top: 10px;
`;
export default function ProductReviews({ product }) {
    const { data: session } = useSession();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [stars, setStars] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    function submitReview() {
        // const data = { title, description, stars, product: product._id };
        // axios.post('/api/reviews', data).then(res => {
        //     setTitle('');
        //     setDescription('');
        //     setStars(0);
        //     loadReviews();
        // });
        if (!title.trim() || !description.trim()) {
            setErrorMessage("Title and description cannot be empty.");
            return;
        }
        const data = { title, description, stars, product: product._id };

        // Check if the user has an order for the specific product
        axios.get('/api/orders').then((res) => {
            const hasOrderForProduct = res.data.some((order) =>
                order.userEmail === session?.user?.email &&
                order.line_items.some(
                    (item) => item.price_data.product_data.name === product.title && order.paid === true
                )
            );

            if (hasOrderForProduct) {
                axios.post('/api/reviews', data).then((res) => {
                    setTitle('');
                    setDescription('');
                    setStars(0);
                    loadReviews();
                });
            } else {
                // User doesn't have an order for the product, handle accordingly
                setErrorMessage("You can only review products you've ordered.");
            }
        });
    }
    useEffect(() => {
        loadReviews();
    }, []);
    function loadReviews() {
        setReviewsLoading(true);
        axios.get('/api/reviews?product=' + product._id).then(res => {
            setReviews(res.data);
            setReviewsLoading(false);
        });
    }
    return (
        <div>
            <Title>Reviews</Title>
            <ColsWrapper>
                <div>
                    <WhiteBox>
                        <Subtitle>{session ? 'Add review' : 'Login to submit a review'}</Subtitle>
                        <div>
                            <StarsRating onChange={setStars} disabled={!session} />
                        </div>
                        <Input
                            value={title}
                            onChange={ev => setTitle(ev.target.value)}
                            placeholder="Title"
                            disabled={!session}
                        />
                        <Textarea
                            value={description}
                            onChange={ev => setDescription(ev.target.value)}
                            placeholder="Was it good? Pros? Cons?"
                            disabled={!session}
                        />
                        <div>
                            <StyledButton primary onClick={submitReview} disabled={!session}>
                                Submit your review
                            </StyledButton>
                            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                        </div>
                    </WhiteBox>
                </div>
                <div>
                    <WhiteBox>
                        <Subtitle>All reviews</Subtitle>
                        {reviewsLoading && (
                            <Spinner fullWidth={true} />
                        )}
                        {reviews.length === 0 && (
                            <p>No reviews :(</p>
                        )}
                        {reviews.length > 0 && reviews.map(review => (
                            <ReviewWrapper key={review._id}>
                                <ReviewHeader>
                                    <StarsRating size={'sm'} disabled={true} defaultHowMany={review.stars} />

                                    <time>{(new Date(review.createdAt)).toLocaleString('sv-SE')}</time>

                                </ReviewHeader>
                                <h3>{review.title}</h3>
                                <p>{review.description}</p>
                            </ReviewWrapper>
                        ))}
                    </WhiteBox>
                </div>
            </ColsWrapper >
        </div >
    );
}