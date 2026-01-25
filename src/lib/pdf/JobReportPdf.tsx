import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './styles';
import { JobData } from '../database.types';

interface JobReportPdfProps {
    job: JobData;
    businessName: string;
}

export const JobReportPdf: React.FC<JobReportPdfProps> = ({ job, businessName }) => {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Not specified';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTimeSlot = (slot?: string) => {
        if (!slot) return '';
        return ` (${slot})`;
    };

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.header}>
                    <Text style={pdfStyles.title}>Job Report</Text>
                    <Text style={pdfStyles.subtitle}>
                        Reference: {job.display_job_id || job.job_id}
                    </Text>
                    <View style={pdfStyles.statusBadge}>
                        <Text>{job.status}</Text>
                    </View>
                </View>

                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>Service Details</Text>
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Home Size:</Text>
                        <Text style={pdfStyles.value}>{job.homeSize}</Text>
                    </View>
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Packing Service:</Text>
                        <Text style={pdfStyles.value}>{job.packingService || 'None'}</Text>
                    </View>
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Dismantle Package:</Text>
                        <Text style={pdfStyles.value}>{job.dismantlePackage ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Total Items:</Text>
                        <Text style={pdfStyles.value}>{job.furnitureItems.length}</Text>
                    </View>
                </View>

                {job.furnitureItems.length > 0 && (
                    <View style={pdfStyles.section}>
                        <Text style={pdfStyles.sectionTitle}>Furniture Items</Text>
                        <View style={pdfStyles.grid}>
                            {job.furnitureItems.map((item, idx) => (
                                <View key={idx} style={pdfStyles.gridItem}>
                                    <Text style={pdfStyles.gridItemText}>
                                        {item.quantity}x {item.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {job.packingMaterials.length > 0 && (
                    <View style={pdfStyles.section}>
                        <Text style={pdfStyles.sectionTitle}>Packing Materials</Text>
                        <View style={pdfStyles.grid}>
                            {job.packingMaterials.map((material, idx) => (
                                <View key={idx} style={pdfStyles.gridItem}>
                                    <Text style={pdfStyles.gridItemText}>
                                        {material.quantity}x {material.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>Addresses</Text>
                    {job.collectionAddress && (
                        <View style={pdfStyles.addressBox}>
                            <Text style={pdfStyles.addressTitle}>Collection Address</Text>
                            <Text style={pdfStyles.addressText}>{job.collectionAddress.address}</Text>
                            <Text style={pdfStyles.addressText}>Postcode: {job.collectionAddress.postcode}</Text>
                            <Text style={pdfStyles.addressText}>Floor: {job.collectionAddress.floor}</Text>
                            <Text style={pdfStyles.addressText}>
                                Parking: {job.collectionAddress.hasParking ? 'Available' : 'Not Available'}
                            </Text>
                            <Text style={pdfStyles.addressText}>
                                Lift: {job.collectionAddress.hasLift ? 'Available' : 'Not Available'}
                            </Text>
                        </View>
                    )}
                    {job.deliveryAddress && (
                        <View style={pdfStyles.addressBox}>
                            <Text style={pdfStyles.addressTitle}>Delivery Address</Text>
                            <Text style={pdfStyles.addressText}>{job.deliveryAddress.address}</Text>
                            <Text style={pdfStyles.addressText}>Postcode: {job.deliveryAddress.postcode}</Text>
                            <Text style={pdfStyles.addressText}>Floor: {job.deliveryAddress.floor}</Text>
                            <Text style={pdfStyles.addressText}>
                                Parking: {job.deliveryAddress.hasParking ? 'Available' : 'Not Available'}
                            </Text>
                            <Text style={pdfStyles.addressText}>
                                Lift: {job.deliveryAddress.hasLift ? 'Available' : 'Not Available'}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>Schedule</Text>
                    {job.collectionDate && (
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Collection Date:</Text>
                            <Text style={pdfStyles.value}>
                                {formatDate(job.collectionDate.date)}
                                {formatTimeSlot(job.collectionDate.timeSlot)}
                            </Text>
                        </View>
                    )}
                    {job.materialsDeliveryDate && (
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Materials Delivery:</Text>
                            <Text style={pdfStyles.value}>
                                {formatDate(job.materialsDeliveryDate.date)}
                                {formatTimeSlot(job.materialsDeliveryDate.timeSlot)}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>Customer Contact</Text>
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Name:</Text>
                        <Text style={pdfStyles.value}>
                            {job.contact.firstName} {job.contact.lastName}
                        </Text>
                    </View>
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Email:</Text>
                        <Text style={pdfStyles.value}>{job.contact.email}</Text>
                    </View>
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Phone:</Text>
                        <Text style={pdfStyles.value}>
                            {job.contact.countryCode} {job.contact.phone}
                        </Text>
                    </View>
                </View>

                {job.costBreakdown && (
                    <View style={pdfStyles.section}>
                        <Text style={pdfStyles.sectionTitle}>Cost Breakdown</Text>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Base Price:</Text>
                            <Text style={pdfStyles.value}>£{job.costBreakdown.basePrice.toFixed(2)}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Furniture Charge:</Text>
                            <Text style={pdfStyles.value}>£{job.costBreakdown.furnitureCharge.toFixed(2)}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Packing Materials:</Text>
                            <Text style={pdfStyles.value}>£{job.costBreakdown.packingMaterialsCharge.toFixed(2)}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Distance Surcharge:</Text>
                            <Text style={pdfStyles.value}>£{job.costBreakdown.distanceSurcharge.toFixed(2)}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Floor Surcharge:</Text>
                            <Text style={pdfStyles.value}>£{job.costBreakdown.floorSurcharge.toFixed(2)}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Total:</Text>
                            <Text style={pdfStyles.value}>£{job.costBreakdown.total.toFixed(2)}</Text>
                        </View>
                    </View>
                )}

                <View style={pdfStyles.footer}>
                    <Text>
                        {businessName} • Generated on {new Date().toLocaleDateString('en-GB')}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};
