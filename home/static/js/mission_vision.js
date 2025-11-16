class MissionVision {
    constructor(containerSelector) {
        this.container = $(containerSelector);
        this.grid = this.container.find('#mission-points-grid');
        this.url = "/static/data/mission_vision.json"; // Correct path to the new JSON file
        this.init();
    }

    init() {
        this.fetchData();
    }

    fetchData() {
        $.ajax({
            url: this.url,
            dataType: "json",
            success: (data) => {
                this.render(data);
            },
            error: (error) => {
                console.error("Error fetching mission points data:", error);
                this.grid.html('<p class="text-red-500">Error loading mission points.</p>');
            }
        });
    }

    render(data) {
        this.grid.empty(); // Clear existing content

        if (data && data.points && Array.isArray(data.points)) {
            data.points.forEach(point => {
                // Note: Lucide icons are not directly supported here as in React.
                // We are creating a simple representation.
                // For a full implementation, you would need an icon library or SVGs.
                const iconHtml = `
                    <div class="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                        <span class="h-8 w-8">${point.icon}</span>
                    </div>
                `;

                const pointHtml = `
                    <div class="flex flex-col items-center">
                        ${iconHtml}
                        <h3 class="text-2xl font-bold">${point.title}</h3>
                        <p class="mt-2 text-muted-foreground">${point.description}</p>
                    </div>
                `;
                this.grid.append(pointHtml);
            });
        }
    }
}

$(document).ready(() => {
    // Ensure this selector matches the one in the template
    new MissionVision(".py-16.lg\:py-24.bg-background");
});
