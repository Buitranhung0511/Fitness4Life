// PackageMain.jsx
import { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import { fetchAllPackage } from '../../../services/PackageService';
import'../../../assets/css/package.css'
function PackageMain() {
    const [dataPackage, setDataPackage] = useState([]);

    useEffect(() => {
        loadPackage();
    }, []);

    const loadPackage = async () => {
        try {
            const result = await fetchAllPackage();
            setDataPackage(result.data.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    return (
        <section id="services">
            <div style={{ padding: '20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Packages</h2>

                <Row gutter={[16, 16]} justify="center"> {/* Gutter and center alignment */}
                    {dataPackage.map((pkg) => (
                        <Col key={pkg.id} xs={24} sm={24} md={8} lg={8}> {/* 3 items per row */}
                            <Card
                                className="custom-card" // Add custom CSS class
                                title={
                                    <div className="card-header" style={{border:'solid 1px black'}}>
                                        <span>{pkg.packageName}</span>
                                    </div>
                                }
                                bordered={false}
                                hoverable
                                style={{border:'solid 1px black'}}
                                
                                
                            >
                                <p className="card-description"><strong>Description:</strong> {pkg.description}</p>
                                <p className="card-duration"><strong>Duration:</strong> {pkg.durationMonth} months</p>
                                <p className="card-price">{pkg.price.toLocaleString('vi-VN')} VND</p>
                                <div className="card-footer">
                                    <Button type="primary" href="#" className="paynow-btn">
                                        Paynow
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
}

export default PackageMain;
