<template>
  <div>
    <div class="f5 fw7 mt4 mb2">
      Step 1: Upload files
      <span class="pl1">
        <CompleteIcon v-if="uploadedFiles.length" alt="complete" style="height: 1.2rem;" class="v-mid" />
      </span>
    </div>
    <input type="file" multiple id="file" class="dn" data-cy="file-upload"/>
    <div v-if="uploadedFiles.length === 0"
      @click="onFileClick" @drop="onFileDrop"
      @dragenter="dragging=true" @dragend="dragging=false" @dragleave="dragging=false" @dragover.prevent
      class="dropfile mb2 pa2 w-100 br3 shadow-4 bg-white color-navy" :class="{dragging: dragging}">
      <div class="o-80 glow">
        <label for="add-files" class="flex items-center h4 pointer">
          <svg viewBox="0 0 100 100" class="fill-aqua" height="60px" alt="Add">
            <path d="M71.13 28.87a29.88 29.88 0 1 0 0 42.26 29.86 29.86 0 0 0 0-42.26zm-18.39 37.6h-5.48V52.74H33.53v-5.48h13.73V33.53h5.48v13.73h13.73v5.48H52.74z" />
          </svg>
          <div class="f5 charcoal">
            <p>
              <strong>Drop one or more files here or click to select.</strong> Directory upload is not supported, but you may select multiple files using Ctrl+Click or Command+Click.
            </p>
          </div>
        </label>
      </div>
    </div>
    <div v-else class="mt2">
      <span @click="resetUpload" class="textLink" data-cy="reset-files">Reset Files</span>
      <div class="mv2 pl3 pa2 w-100 br3 shadow-4 bg-white color-navy flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="fill-aqua" height="60px">
          <path d="M55.94 19.17H30a4 4 0 0 0-4 4v53.65a4 4 0 0 0 4 4h40.1a4 4 0 0 0 4-4V38.06zm5.28 21.08c-4.33 0-7.47-2.85-7.47-6.77V21l18.13 19.25z" />
        </svg>
        <ul class="list pl0">
          <li v-for="(file, idx) in uploadedFiles" :key="`file-${idx}`" data-cy="uploaded-file">{{file.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import CompleteIcon from '../static/images/complete.svg?inline'

export default {
  components: {
    CompleteIcon
  },
  props: {
    onFileClick: Function,
    onFileDrop: Function,
    resetFileUpload: Function,
    uploadedFiles: Array
  },
  data: self => {
    return {
      dragging: false
    }
  },
  methods: {
    resetUpload: function () {
      this.dragging = false
      this.resetFileUpload()
    }
  }
}
</script>

<style scoped>
.textLink {
  color: blue;
  cursor: pointer;
}

.dropfile * {
  pointer-events: none;
}

.dropfile {
  cursor: pointer;
}

.dragging {
  border: 5px solid #69c4cd;
}
</style>
