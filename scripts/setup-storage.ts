import { supabaseAdmin } from '../lib/supabase'

async function setupBuckets() {
    const buckets = ['categories', 'catalogues', 'products']

    for (const bucketName of buckets) {
        const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/*'],
            fileSizeLimit: 5242880 // 5MB
        })

        if (error) {
            console.log(`Bucket "${bucketName}" creation error:`, error.message)
        } else {
            console.log(`Bucket "${bucketName}" created successfully.`)
        }
    }
}

setupBuckets()
