import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Helmet } from "react-helmet";
import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import ImageSelector from '../components/utils/ImageSelector';
import ImageResult from '../components/utils/ImageResult';

import "./styles/classification.css";
import SEO from "../data/seo";
import INFO from "../data/user";

const Classification = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "about");

	const [imageData, setImageData] = useState(null);
	const [classificationResult, setClassificationResult] = useState(null);
	const [loading, setLoading] = useState(false);

	const classifyImage = async () => {
		if (!imageData) {
			alert('Please select an image first!');
			return;
		}

		const formData = new FormData();
		formData.append('file', imageData); // ✅ sesuai dengan backend

		setLoading(true);
		try {
			const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			console.log('Response from backend:', response.data); // ✅ Debug log

			if (response.data) {
				setClassificationResult(response.data); // ✅ simpan hasil langsung
			}
		} catch (error) {
			console.error('Error sending the image:', error);
			alert('An error occurred while classifying the image.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`About | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="about" />
				<div className="content-wrapper">
					<div className="about-logo-container">
						<div className="about-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="container">
						<div className="experience" id="classification">
							<header className="experience-header">
								<h1 className="title-classification">Classification Brain</h1>
								<p>Upload an image from your device to classify it.</p>
							</header>
							<main>
								<ImageSelector setImageData={setImageData} setClassificationResult={setClassificationResult} />
								{imageData && (
									<div className="preview">
										<div className="image-preview">
											<img src={URL.createObjectURL(imageData)} alt="Selected Preview" className="preview-image" />
											{loading && <div className="scanning-overlay"></div>} {/* Display scanning overlay when loading */}
											<button onClick={classifyImage} disabled={loading} className="classify-button">
												{loading ? 'Classifying...' : 'Classify Image'}
											</button>
										</div>
									</div>
								)}
								<ImageResult classificationResult={classificationResult} />
							</main>
						</div>
					</div>

					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Classification;
