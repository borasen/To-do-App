<script>
    import Header from './components/Header.svelte';
    import TodoList from './components/TodoList.svelte';
    import Footer from './components/Footer.svelte';
</script>

<div class="container">
    <div class="row">
        <div class="col">
            <Header />
        </div>
    </div>
    <div class="row">
        <div class="col">
            <TodoList />
        </div>
    </div>
    <div class="row">
        <div class="col">
            <Footer />
        </div>
    </div>
</div>
