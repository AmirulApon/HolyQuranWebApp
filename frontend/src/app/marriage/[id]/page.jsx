import ProfileDetails from './ProfileDetails';

export async function generateStaticParams() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        let page = 1;
        let allIds = [];
        let lastPage = 1;

        // Initial fetch to get pagination info and first page data
        const res = await fetch(`${apiUrl}/marriage-profiles?page=${page}`);
        if (!res.ok) {
            console.error('Failed to fetch marriage profiles for static params');
            return [];
        }
        const data = await res.json();
        
        if (data.data && Array.isArray(data.data)) {
            allIds = [...allIds, ...data.data.map(profile => ({ id: profile.id.toString() }))];
        }
        
        lastPage = data.last_page || 1;

        // Fetch remaining pages if any
        while (page < lastPage) {
            page++;
            const nextRes = await fetch(`${apiUrl}/marriage-profiles?page=${page}`);
            if (nextRes.ok) {
                const nextData = await nextRes.json();
                if (nextData.data && Array.isArray(nextData.data)) {
                    allIds = [...allIds, ...nextData.data.map(profile => ({ id: profile.id.toString() }))];
                }
            }
        }

        return allIds;
    } catch (error) {
        console.error('Error generating static params for marriage profiles:', error);
        return [];
    }
}

export default async function Page({ params }) {
    const { id } = await params;
    return <ProfileDetails id={id} />;
}
