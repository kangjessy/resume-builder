// WYSIWYG Formatting (menggunakan execCommand untuk simplicity)
function formatText(command, targetId = 'keySkills') {
    const editor = document.getElementById(targetId);
    if (document.activeElement !== editor) {
        editor.focus();
    }
    document.execCommand(command, false, null);
    editor.focus();
}

// Add Experience Section
let sectionCounter = 2;
function addExperienceSection() {
    const container = document.getElementById('experiences');
    const newSection = document.createElement('div');
    newSection.className = 'experience-section';
    newSection.innerHTML = `
        <div class="form-row">
            <div>
                <label for="company${sectionCounter}">Nama Perusahaan</label>
                <input type="text" id="company${sectionCounter}" placeholder="Nama perusahaan">
            </div>
            <div>
                <label for="startDate${sectionCounter}">Waktu Mulai</label>
                <input type="text" id="startDate${sectionCounter}" placeholder="Misal: Jan 2020">
            </div>
        </div>
        <div class="form-row">
            <div>
                <label for="endDate${sectionCounter}">Waktu Akhir</label>
                <input type="text" id="endDate${sectionCounter}" placeholder="Misal: Des 2023">
            </div>
            <div>
                <label for="position${sectionCounter}">Posisi</label>
                <input type="text" id="position${sectionCounter}" placeholder="Misal: Developer">
            </div>
        </div>
        <div class="form-row">
            <div class="full-row">
                <label for="description${sectionCounter}">Deskripsi</label>
                <textarea id="description${sectionCounter}" placeholder="Deskripsikan pengalaman Anda..."></textarea>
            </div>
        </div>
        <button type="button" class="remove-section" onclick="removeSection(this)">Hapus Section</button>
    `;
    container.appendChild(newSection);
    sectionCounter++;
}

// Remove Experience Section
function removeSection(button) {
    if (confirm('Hapus section ini?')) {
        button.parentElement.remove();
    }
}

// Auto-focus pada WYSIWYG saat diklik label
document.querySelectorAll('label[for="keySkills"], label[for="education"], label[for="certificates"]').forEach(label => {
    label.addEventListener('click', function () {
        const id = this.getAttribute('for');
        document.getElementById(id).focus();
    });
});