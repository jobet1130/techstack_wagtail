class FeaturedPrograms {
    constructor(containerId, dataScriptId) {
        this.container = $(`#${containerId}`);
        this.dataScript = $(`#${dataScriptId}`);

        if (this.container.length === 0) {
            console.error("FeaturedPrograms container not found.");
            return;
        }
        if (this.dataScript.length === 0) {
            console.error("FeaturedPrograms data script not found.");
            return;
        }

        this.init();
    }

    init() {
        const data = this.loadProgramData();
        if (data && data.length > 0) {
            this.renderPrograms(data);
        } else {
            this.renderError("No featured programs to display.");
        }
    }

    loadProgramData() {
        try {
            const jsonData = this.dataScript.text();
            return JSON.parse(jsonData);
        } catch (error) {
            console.error("Error parsing featured programs JSON data:", error);
            return null;
        }
    }

    renderPrograms(programs) {
        const programsContainer = this.container.find('.columns');
        programsContainer.empty(); // Clear existing content

        programs.forEach(program => {
            const programCard = this.createProgramCard(program);
            programsContainer.append(programCard);
        });

        this.addHoverEffects();
    }

    createProgramCard(program) {
        // Use the image_url provided from the backend render method
        const imageUrl = program.image_url ? program.image_url : '/static/images/placeholder.jpg'; 

        return `
            <div class="column is-one-third">
                <div class="card">
                    <div class="card-image">
                        <figure class="image is-4by3">
                            <img src="${imageUrl}" alt="${program.title}">
                        </figure>
                    </div>
                    <div class="card-content">
                        <p class="title is-4">${program.title}</p>
                        <div class="content">${program.short_description}</div>
                        <a href="${program.page_url}" class="button is-primary">Learn More</a>
                    </div>
                </div>
            </div>
        `;
    }

    addHoverEffects() {
        this.container.find('.card').hover(
            function() {
                $(this).addClass('is-hovered');
            },
            function() {
                $(this).removeClass('is-hovered');
            }
        );
    }

    renderError(message = "Could not load featured programs.") {
        this.container.find('.columns').html(`<p class="has-text-danger">${message}</p>`);
    }
}

$(document).ready(() => {
    new FeaturedPrograms('featured-programs-section', 'featured-programs-data');
});
