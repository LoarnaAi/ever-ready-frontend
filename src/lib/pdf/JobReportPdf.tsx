import { pdfStyles } from './styles';
import { JobData } from '../database.types';

type PdfComponents = {
    Document: typeof import('@react-pdf/renderer').Document;
    Page: typeof import('@react-pdf/renderer').Page;
    Text: typeof import('@react-pdf/renderer').Text;
    View: typeof import('@react-pdf/renderer').View;
};

// Factory function that creates the PDF document using provided module instances.
// This avoids Next.js' internal React runtime (react.transitional.element) leaking
// into @react-pdf/renderer, which expects standard React elements.
export function createJobReportDocument(
    React: typeof import('react'),
    components: PdfComponents,
    job: JobData,
    businessName: string
) {
    const { Document, Page, Text, View } = components;

    const h = React.createElement;

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

    // Build furniture items section
    const furnitureSection = job.furnitureItems && job.furnitureItems.length > 0
        ? h(View, { style: pdfStyles.section },
            h(Text, { style: pdfStyles.sectionTitle }, 'Furniture Items'),
            h(View, { style: pdfStyles.grid },
                job.furnitureItems.map((item, idx) =>
                    h(View, { key: String(idx), style: pdfStyles.gridItem },
                        h(Text, { style: pdfStyles.gridItemText }, `${item.quantity}x ${item.name}`)
                    )
                )
            )
        )
        : null;

    // Build packing materials section
    const packingSection = job.packingMaterials && job.packingMaterials.length > 0
        ? h(View, { style: pdfStyles.section },
            h(Text, { style: pdfStyles.sectionTitle }, 'Packing Materials'),
            h(View, { style: pdfStyles.grid },
                job.packingMaterials.map((material, idx) =>
                    h(View, { key: String(idx), style: pdfStyles.gridItem },
                        h(Text, { style: pdfStyles.gridItemText }, `${material.quantity}x ${material.name}`)
                    )
                )
            )
        )
        : null;

    // Build collection address section
    const collectionAddressSection = job.collectionAddress
        ? h(View, { style: pdfStyles.addressBox },
            h(Text, { style: pdfStyles.addressTitle }, 'Collection Address'),
            h(Text, { style: pdfStyles.addressText }, String(job.collectionAddress.address || '')),
            h(Text, { style: pdfStyles.addressText }, `Postcode: ${job.collectionAddress.postcode || ''}`),
            h(Text, { style: pdfStyles.addressText }, `Floor: ${job.collectionAddress.floor || ''}`),
            h(Text, { style: pdfStyles.addressText }, `Parking: ${job.collectionAddress.hasParking ? 'Available' : 'Not Available'}`),
            h(Text, { style: pdfStyles.addressText }, `Lift: ${job.collectionAddress.hasLift ? 'Available' : 'Not Available'}`)
        )
        : null;

    // Build delivery address section
    const deliveryAddressSection = job.deliveryAddress
        ? h(View, { style: pdfStyles.addressBox },
            h(Text, { style: pdfStyles.addressTitle }, 'Delivery Address'),
            h(Text, { style: pdfStyles.addressText }, String(job.deliveryAddress.address || '')),
            h(Text, { style: pdfStyles.addressText }, `Postcode: ${job.deliveryAddress.postcode || ''}`),
            h(Text, { style: pdfStyles.addressText }, `Floor: ${job.deliveryAddress.floor || ''}`),
            h(Text, { style: pdfStyles.addressText }, `Parking: ${job.deliveryAddress.hasParking ? 'Available' : 'Not Available'}`),
            h(Text, { style: pdfStyles.addressText }, `Lift: ${job.deliveryAddress.hasLift ? 'Available' : 'Not Available'}`)
        )
        : null;

    // Build schedule section
    const collectionDateRow = job.collectionDate
        ? h(View, { style: pdfStyles.row },
            h(Text, { style: pdfStyles.label }, 'Collection Date:'),
            h(Text, { style: pdfStyles.value }, `${formatDate(job.collectionDate.date)}${formatTimeSlot(job.collectionDate.timeSlot)}`)
        )
        : null;

    const materialsDateRow = job.materialsDeliveryDate
        ? h(View, { style: pdfStyles.row },
            h(Text, { style: pdfStyles.label }, 'Materials Delivery:'),
            h(Text, { style: pdfStyles.value }, `${formatDate(job.materialsDeliveryDate.date)}${formatTimeSlot(job.materialsDeliveryDate.timeSlot)}`)
        )
        : null;

    // Build cost breakdown section
    const costSection = job.costBreakdown
        ? h(View, { style: pdfStyles.section },
            h(Text, { style: pdfStyles.sectionTitle }, 'Cost Breakdown'),
            h(View, { style: pdfStyles.row },
                h(Text, { style: pdfStyles.label }, 'Base Price:'),
                h(Text, { style: pdfStyles.value }, `£${job.costBreakdown.basePrice.toFixed(2)}`)
            ),
            h(View, { style: pdfStyles.row },
                h(Text, { style: pdfStyles.label }, 'Furniture Charge:'),
                h(Text, { style: pdfStyles.value }, `£${job.costBreakdown.furnitureCharge.toFixed(2)}`)
            ),
            h(View, { style: pdfStyles.row },
                h(Text, { style: pdfStyles.label }, 'Packing Materials:'),
                h(Text, { style: pdfStyles.value }, `£${job.costBreakdown.packingMaterialsCharge.toFixed(2)}`)
            ),
            h(View, { style: pdfStyles.row },
                h(Text, { style: pdfStyles.label }, 'Distance Surcharge:'),
                h(Text, { style: pdfStyles.value }, `£${job.costBreakdown.distanceSurcharge.toFixed(2)}`)
            ),
            h(View, { style: pdfStyles.row },
                h(Text, { style: pdfStyles.label }, 'Floor Surcharge:'),
                h(Text, { style: pdfStyles.value }, `£${job.costBreakdown.floorSurcharge.toFixed(2)}`)
            ),
            h(View, { style: pdfStyles.row },
                h(Text, { style: pdfStyles.label }, 'Total:'),
                h(Text, { style: pdfStyles.value }, `£${job.costBreakdown.total.toFixed(2)}`)
            )
        )
        : null;

    return h(Document, null,
        h(Page, { size: 'A4', style: pdfStyles.page },
            // Header
            h(View, { style: pdfStyles.header },
                h(Text, { style: pdfStyles.title }, 'Job Report'),
                h(Text, { style: pdfStyles.subtitle }, `Reference: ${job.display_job_id || job.job_id}`),
                h(View, { style: pdfStyles.statusBadge },
                    h(Text, null, String(job.status || ''))
                )
            ),
            // Service Details
            h(View, { style: pdfStyles.section },
                h(Text, { style: pdfStyles.sectionTitle }, 'Service Details'),
                h(View, { style: pdfStyles.row },
                    h(Text, { style: pdfStyles.label }, 'Home Size:'),
                    h(Text, { style: pdfStyles.value }, String(job.homeSize || ''))
                ),
                h(View, { style: pdfStyles.row },
                    h(Text, { style: pdfStyles.label }, 'Packing Service:'),
                    h(Text, { style: pdfStyles.value }, String(job.packingService || 'None'))
                ),
                h(View, { style: pdfStyles.row },
                    h(Text, { style: pdfStyles.label }, 'Dismantle Package:'),
                    h(Text, { style: pdfStyles.value }, job.dismantlePackage ? 'Yes' : 'No')
                ),
                h(View, { style: pdfStyles.row },
                    h(Text, { style: pdfStyles.label }, 'Total Items:'),
                    h(Text, { style: pdfStyles.value }, String(job.furnitureItems?.length || 0))
                )
            ),
            // Furniture Items
            furnitureSection,
            // Packing Materials
            packingSection,
            // Addresses
            h(View, { style: pdfStyles.section },
                h(Text, { style: pdfStyles.sectionTitle }, 'Addresses'),
                collectionAddressSection,
                deliveryAddressSection
            ),
            // Schedule
            h(View, { style: pdfStyles.section },
                h(Text, { style: pdfStyles.sectionTitle }, 'Schedule'),
                collectionDateRow,
                materialsDateRow
            ),
            // Customer Contact
            h(View, { style: pdfStyles.section },
                h(Text, { style: pdfStyles.sectionTitle }, 'Customer Contact'),
                h(View, { style: pdfStyles.row },
                    h(Text, { style: pdfStyles.label }, 'Name:'),
                    h(Text, { style: pdfStyles.value }, `${job.contact?.firstName || ''} ${job.contact?.lastName || ''}`)
                ),
                h(View, { style: pdfStyles.row },
                    h(Text, { style: pdfStyles.label }, 'Email:'),
                    h(Text, { style: pdfStyles.value }, String(job.contact?.email || ''))
                ),
                h(View, { style: pdfStyles.row },
                    h(Text, { style: pdfStyles.label }, 'Phone:'),
                    h(Text, { style: pdfStyles.value }, `${job.contact?.countryCode || ''} ${job.contact?.phone || ''}`)
                )
            ),
            // Cost Breakdown
            costSection,
            // Footer
            h(View, { style: pdfStyles.footer },
                h(Text, null, `${businessName} • Generated on ${new Date().toLocaleDateString('en-GB')}`)
            )
        )
    );
}
